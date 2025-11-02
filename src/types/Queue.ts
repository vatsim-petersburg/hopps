import {Message} from "./Message";

export type Queue<T extends object = any> = {
    name: string;
    consumer: (msg: Message<T>) => void | Promise<void>;
};