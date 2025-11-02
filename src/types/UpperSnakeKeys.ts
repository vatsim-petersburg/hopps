import {DotToUpperSnake} from "./DotToUpperSnake";

export type UpperSnakeKeys<T extends readonly string[]> = { [K in T[number] as DotToUpperSnake<K>]: K };