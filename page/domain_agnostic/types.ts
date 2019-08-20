export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

export type Exhaustive<T> = { [K in keyof T]: T[K] }

// prettier-ignore
export type Unpacked<T> =
 T extends (infer U)[] ? U
 : T extends (...args: any[]) => infer U ? U
 : T extends Promise<infer U> ? U : T
