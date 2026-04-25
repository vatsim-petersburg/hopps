import {Channel} from "amqplib";

export type Plugin = (channel: Channel) => void;