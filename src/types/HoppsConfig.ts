import {Queue} from "./Queue";

/**
 * Configuration options for initializing the Hopps instance
 */
export type HoppsConfig<T extends readonly string[]> = {
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
};