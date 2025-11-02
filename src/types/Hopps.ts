import {UpperSnakeKeys} from "./UpperSnakeKeys";
import {Options} from "amqplib";

/**
 * Hopps instance returned after successful connection
 */
export type Hopps<T extends readonly string[]> = {
    /** Logging function with `Hopps:` prefix */
    log: typeof console.log;
    /**
     * Normalized outbound queue names in UPPER_SNAKE_CASE
     * @example 'foo.bar.baz' -> 'FOO_BAR_BAZ'
     */
    outbound: UpperSnakeKeys<T>;
    /** Send message to a specific queue */
    sendToQueue: <TContent extends object>(
        queue: string,
        content: TContent,
        options?: Options.Publish
    ) => boolean;
    /** Send message and wait for reply (RPC pattern) */
    sendAndWaitForReply: <TContent extends object, TReply extends object>(
        queue: string,
        content: TContent,
        options?: Options.Publish
    ) => Promise<TReply>;
};