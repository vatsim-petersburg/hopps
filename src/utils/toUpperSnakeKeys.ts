import {DotToUpperSnake} from "../types";
import {UpperSnakeKeys} from "../types";

export const toUpperSnakeKeys = <const T extends readonly string[]>(
    arr: T
): UpperSnakeKeys<T> =>
    arr.reduce((acc, key) => {
        const transformed = key
            .split(".")
            .map((part) => part.toUpperCase())
            .join("_") as DotToUpperSnake<typeof key>;

        acc[transformed] = key;
        return acc;
    }, {} as any);