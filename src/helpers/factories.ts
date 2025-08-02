import { isAsync, async, sync } from "./schema-types";

const Factory = {
	schema<Args extends unknown[], Schema>(schema: new (...args: Args) => Schema) {
		return (...args: Args) => new schema(...args) as isAsync<Schema> extends true ? async<Schema> : sync<Schema>;
	},
};

type Factory = typeof Factory;

export { Factory };
