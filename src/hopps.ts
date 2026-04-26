import { connect, ConsumeMessage, Options } from "amqplib";
import { toUpperSnakeKeys } from "./utils/toUpperSnakeKeys";
import { DRT_QUEUE } from "./constants/constants";
import type { Hopps, HoppsConfig, UpperSnakeKeys } from "./types";
import type { Plugin } from "./types/Plugin";
import {sendAndWaitForReply} from "./modules/sendAndWaitForReply";
import { log } from "./utils/log";

export function hopps<const T extends readonly string[], P extends Record<string, Plugin>>(
    config: HoppsConfig<T, P> & { consumeDRT: true }
): Promise<Hopps<T, P>>;

export function hopps<const T extends readonly string[], P extends Record<string, Plugin>>(
    config: HoppsConfig<T, P> & { consumeDRT?: false }
): Promise<Hopps<T, P> & { sendAndWaitForReply: never }>;

/**
 * Initializes and configures an Hopps instance with RabbitMQ
 *
 * @example
 * ```typescript
 * import { quxQuzHandler } from './quxQuzHandler';
 *
 * const amqp = await hopps({
 *   rabbitMqUrl: 'amqp://localhost',
 *   inboundQueues: [quxQuzHandler],
 *   outboundQueues: ['foo.bar.baz', 'baz.bar.foo'],
 *   consumeDRT: true
 * });
 * ```
 *
 * @param {HoppsConfig} config - Configuration object for Hopps instance
 * @returns {Promise<Hopps>} Hopps instance
 */
export async function hopps<const T extends readonly string[], P extends Record<string, Plugin>>({
  rabbitMqUrl,
  inboundQueues,
  outboundQueues,
  requeueOnError: globalRequeueOnError = true,
  consumeDRT = false,
  plugins
}: HoppsConfig<T, P>): Promise<Hopps<T, P>> {
    try {
        const connection = await connect(rabbitMqUrl);
        log.info('Connected to RabbitMQ');

        const channel = await connection.createChannel();
        log.info('Created channel for RabbitMQ connection');

        if(inboundQueues) {
            for(const { name, consumer, requeueOnError } of inboundQueues) {
                await channel.assertQueue(name, { durable: true });
                log.info('Asserted inbound queue', name);

                void channel.consume(name, async (msg) => {
                    if(!msg) return;

                    try {
                        await consumer({
                            ...msg,
                            content: JSON.parse(msg.content.toString()),
                        });
                        channel.ack(msg);
                    } catch(e) {
                        log.error('Inner consumer error', e);
                        channel.nack(msg, false, requeueOnError ?? globalRequeueOnError);
                    }
                }, { noAck: false });
                log.info('Consuming inbound queue', name);
            }
        }

        const outbound = outboundQueues ? toUpperSnakeKeys<T>(outboundQueues) : {} as UpperSnakeKeys<T>;
        if(outboundQueues) {
            for(const name of outboundQueues) {
                await channel.assertQueue(name, { durable: true });
                log.info('Asserted outbound queue', name);
            }
        }

        const drtReplies = new Map<string, (msg: ConsumeMessage) => void>();
        if(consumeDRT) {
            await channel.consume(DRT_QUEUE, (msg) => {
                if(!msg) return;
                if(!msg.properties.correlationId) return;
                if(!drtReplies.has(msg.properties.correlationId)) return;

                drtReplies.get(msg.properties.correlationId)!(msg);
                drtReplies.delete(msg.properties.correlationId);
            }, { noAck: true });
        }

        const pluginsAccessors = {} as Hopps<T, P>['plugins'];
        if(plugins) {
            for(const [name, func] of Object.entries(plugins)) {
                try {
                    (pluginsAccessors as Record<string, unknown>)[name] = await func(channel, log);
                } catch(e) {
                    log.warn('error initializing plugin', name, e);
                }
            }
        }

        return {
            log,
            outbound,
            sendToQueue: <TContent extends object>(
                queue: string,
                content: TContent,
                options?: Options.Publish
            ) => channel.sendToQueue(queue, Buffer.from(JSON.stringify(content)), options),
            sendAndWaitForReply: <TContent extends object, TReply extends object>(
                queue: string,
                content: TContent,
                options?: Options.Publish
            ) => sendAndWaitForReply<TContent, TReply>(channel, consumeDRT ? drtReplies : undefined, queue, content, options),
            plugins: pluginsAccessors
        }
    } catch(e) {
        log.error('Error connecting to RabbitMQ with', e);
        throw e;
    }
}