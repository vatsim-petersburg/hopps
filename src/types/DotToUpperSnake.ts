export type DotToUpperSnake<T extends string> =
    T extends `${infer Head}.${infer Tail}`
        ? `${Uppercase<Head>}_${DotToUpperSnake<Tail>}`
        : Uppercase<T>;