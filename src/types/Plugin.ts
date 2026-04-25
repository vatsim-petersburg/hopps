import {Channel} from "amqplib";
import {log} from '../utils/log';

export type Plugin = (channel: Channel, hoppsLog: typeof log) => void;