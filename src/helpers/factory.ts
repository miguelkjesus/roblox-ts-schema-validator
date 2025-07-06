export type Factory<S extends new (...args: unknown[]) => unknown> = (
	...args: ConstructorParameters<S>
) => InstanceType<S>;

export function factory<S extends new (...args: unknown[]) => unknown>(func: Factory<S>) {
	return func;
}

factory.fromClass =
	<Args extends unknown[], Return>(schema: new (...args: Args) => Return) =>
	(...args: Args) =>
		new schema(...args);
