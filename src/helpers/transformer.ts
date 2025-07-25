export type Transformer<T = unknown> = (data: T) => T | Promise<T>;
