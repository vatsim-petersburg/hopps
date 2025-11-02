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
     * Whether to consume from the Direct Reply-To queue for RPC pattern
     * @default false
     */
    consumeDRT?: boolean;
};