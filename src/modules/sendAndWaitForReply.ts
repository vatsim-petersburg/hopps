import { Channel, ConsumeMessage, Options } from "amqplib";
import { v7 } from "uuid";

import { DRT_QUEUE } from "../constants/constants";

export const sendAndWaitForReply = async <TContent extends object, TReply extends object>(
    ch: Channel,
    drtReplies: Map<string, (msg: ConsumeMessage) => void> | undefined,
    queue: string,
    content: TContent,
    options?: Options.Publish
): Promise<TReply> => {
    if(!drtReplies) throw new Error('DRT consumer not registered');

    const correlationId = v7();
    const msg = await Promise.race([
        new Promise<ConsumeMessage>((r) => {
            drtReplies.set(correlationId, r);

            ch.sendToQueue(
                queue,
                Buffer.from(JSON.stringify(content)),
                {
                    ...options,
                    replyTo: DRT_QUEUE,
                    correlationId
                }
            );
        }),
        new Promise<never>((_, reject) =>
            setTimeout(() => {
                drtReplies.delete(correlationId);
                reject(new Error("Timeout: no reply received within 30 seconds"));
            }, 30000)
        )
    ])

    return JSON.parse(msg.content.toString()) as TReply;
}