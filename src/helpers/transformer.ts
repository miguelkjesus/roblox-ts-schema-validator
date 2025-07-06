export type Transformer<T = unknown> = (data: T) => T;
export function transformer<Input>(func: Transformer<Input>) {
	return func;
}

export type TransformerFactory<T = unknown, Args extends unknown[] = unknown[]> = (...args: Args) => Transformer<T>;
transformer.factory = <T = unknown, Args extends unknown[] = unknown[]>(func: TransformerFactory<T, Args>) => func;
