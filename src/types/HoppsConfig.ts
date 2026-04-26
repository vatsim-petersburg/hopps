import type {Queue} from "./Queue";
import type {Plugin} from './Plugin';
import type {Hopps} from './Hopps';

/**
 * Configuration options for initializing the Hopps instance
 */
export type HoppsConfig<T extends readonly string[], P extends Record<string, Plugin> = Record<string, Plugin>> = {
    /** RabbitMQ connection URL */
    rabbitMqUrl: string;
    /** Queues to consume messages from */
    inboundQueues?: Queue[];
    /** Queues to send messages to */
    outboundQueues?: T;
    /**
     * Whether to requeue a message when an unhandled error in a consumer is caught
     *
     * Acts as a global setting, can be rewritten in each of the {@link Queue}s
     *
     * More info on the requeue in {@link https://amqp-node.github.io/amqplib/channel_api.html#channel_nack|the amqplib doc}
     *
     * @default true
     */
    requeueOnError?: boolean;
    /**
     * Whether to consume from the Direct Reply-To queue for RPC pattern
     * @default false
     */
    consumeDRT?: boolean;
    /**
     * Named plugin functions that receive the raw amqplib {@link Channel} and the Hopps logger.
     * Each function may return a value (sync or async) that is exposed on the {@link Hopps} instance
     * under the same key, fully typed via the return type of the function.
     *
     * Use with caution - plugins have unrestricted access to the channel.
     *
     * @example
     * ```typescript
     * const amqp = await hopps({
     *   rabbitMqUrl: 'amqp://localhost',
     *   plugins: {
     *     delayed: async (channel) => {
     *       await channel.assertExchange('delayed', 'x-delayed-message', { durable: true });
     *       return { exchange: 'delayed' };
     *     }
     *   }
     * });
     *
     * amqp.plugins.delayed.exchange; // 'delayed'
     * ```
     */
    plugins?: P;
};