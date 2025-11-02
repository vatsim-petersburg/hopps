import {ConsumeMessage} from "amqplib";

export type Message<T extends object> = Omit<ConsumeMessage, 'content'> & { content: T };