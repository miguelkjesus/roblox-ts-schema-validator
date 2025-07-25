import { PropertyKey, Dictionary } from "./types";

export type EnumFromValues<Values extends PropertyKey> = { readonly [K in Values]: K } & {};
export function enumFromValues<const Values extends PropertyKey>(values: Values[]) {
	const Enum = {} as EnumFromValues<Values>;

	for (const value of values) {
		(Enum as Dictionary)[value] = value;
	}

	return Enum;
}

export type EnumFromPairs<Pairs extends readonly [PropertyKey, unknown]> = {
	readonly [Pair in Pairs as Pair[0]]: Pair[1];
} & {};
export function enumFromPairs<const Pairs extends readonly [PropertyKey, unknown]>(pairs: Pairs[]) {
	const Enum = {} as EnumFromPairs<Pairs>;

	for (const [key, value] of pairs) {
		(Enum as Dictionary)[key] = value;
	}

	return Enum;
}
