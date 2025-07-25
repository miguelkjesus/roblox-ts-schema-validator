const factory = {
	constructor:
		<Args extends unknown[], Return>(schema: new (...args: Args) => Return) =>
		(...args: Args) =>
			new schema(...args),
};

export default factory;
