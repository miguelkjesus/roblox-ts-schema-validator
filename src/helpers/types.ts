export type PropertyKey = string | number | symbol;

export type Dictionary<T = unknown> = {
	[key: PropertyKey]: T;
};

export type Simplify<T> = { [K in keyof T]: T[K] } & {};

export type Suggest<T extends string> = T | (string & Record<never, never>);
