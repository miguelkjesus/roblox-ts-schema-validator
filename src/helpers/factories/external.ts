export function constructor<Args extends unknown[], Return>(schema: new (...args: Args) => Return) {
	return (...args: Args) => new schema(...args);
}
