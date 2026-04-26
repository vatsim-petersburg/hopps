import type {UpperSnakeKeys} from "./UpperSnakeKeys";
import type {Options} from "amqplib";
import {log} from "../utils/log";
import type {Plugin} from "./Plugin";
import type {HoppsConfig} from './HoppsConfig';

/**
 * Hopps instance returned after successful connection
 */
export type Hopps<T extends readonly string[], P extends Record<string, Plugin> = Record<string, Plugin>> = {
    /** Logging function for hopps-related messages */
    log: typeof log;
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
    /**
     * Resolved return values of the {@link HoppsConfig.plugins} functions, keyed by plugin name.
     * Each value is the awaited result of the corresponding plugin function, preserving its type.
     */
    plugins: { [K in keyof P]: Awaited<ReturnType<P[K]>> };
};