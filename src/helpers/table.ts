export function isArray(value: unknown): value is unknown[] {
	return typeIs(value, "table");
}

export function ensureArray<T>(value: T | T[]): T[] {
	return isArray(value) ? value : [value];
}

export function isEmpty(value: object): boolean {
	return next(value)[0] === undefined;
}
