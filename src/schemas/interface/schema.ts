import { factory } from "helpers/factory";
import { parseResult } from "helpers/parse";

import { Schema } from "../schema/schema";

export type SchemasOf<T> = { [K in keyof T]: Schema<T[K]> };

export class InterfaceSchema<T extends Record<any, unknown>> extends Schema<T, object> {
	readonly _def = {};
	private shape: SchemasOf<T>;

	constructor(shape: SchemasOf<T>) {
		super();
		this.shape = shape;
	}

	protected _parse(data: unknown) {
		if (!typeIs(data, "table")) {
			return parseResult.fail(""); // TODO
		}

		let success = true;
		const parsed = {} as T;
		const messages = [];

		for (const [key, schema] of pairs(this.shape) as IterableFunction<[keyof T, Schema<T[keyof T]>]>) {
			const value = (data as Record<any, unknown>)[key];

			if (value === undefined) {
				return parseResult.fail(`Missing key ${tostring(key)}`);
			}

			const schemaResult = schema.parse(value);

			if (schemaResult.success) {
				if (success) {
					parsed[key] = schemaResult.data;
				}
			} else {
				messages.push(...schemaResult.messages);
				success = false;
			}
		}

		return success ? parseResult.success(parsed) : parseResult.fail(...messages);
	}
}

// @ts-expect-error interface is a reserved keyword, but need this for compatibility with @rbxts/t
export const interface = factory.fromClass(InterfaceSchema);
