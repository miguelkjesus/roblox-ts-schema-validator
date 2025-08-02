export type PropertyKey = string | number | symbol;

export type Dictionary<T = unknown> = {
	[key: PropertyKey]: T;
};

export type Simplify<T> = { [K in keyof T]: T[K] } & {};

export type Suggest<T extends string> = T | (string & Record<never, never>);

export type conditional<Condition, True, False, Either = True | False, None = never> = Condition extends true
	? True
	: Condition extends false
		? False
		: Condition extends boolean
			? Either
			: None;
