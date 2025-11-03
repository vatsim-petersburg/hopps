import {Message} from "./Message";

export type Queue<T extends object = any> = {
    /**
     * Queue name under RabbitMQ naming conventions
     *
     * @example foo.bar
     * @example foo.bar.baz
     */
    name: string;
    consumer: (msg: Message<T>) => void | Promise<void>;
    /**
     * Whether to requeue a message when an unhandled error in the consumer is caught
     *
     * Overrides the global `requeueOnError`, that can be provided during the configuration of the Hopps instance
     *
     * More info on the requeue in {@link https://amqp-node.github.io/amqplib/channel_api.html#channel_nack|the amqplib doc}
     */
    requeueOnError?: boolean;
};