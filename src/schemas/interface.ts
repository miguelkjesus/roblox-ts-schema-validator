import ErrorMessage from "helpers/error-message";
import factory from "helpers/factories";
import ParseContext from "helpers/parse-context";
import { Dictionary, PropertyKey } from "helpers/types";

import Schema from "./schema";

export type SchemasOf<T> = { [K in keyof T]: Schema<T[K]> } & {};

export class InterfaceSchema<T extends Dictionary> extends Schema<T> {
	readonly shape: SchemasOf<T>;

	private _invalidType = ErrorMessage.implement(({ data }) => `Expected table, recieved ${typeOf(data)}`);

	constructor(shape: SchemasOf<T>) {
		super();
		this.shape = shape;
	}

	protected preprocess(context: ParseContext) {
		if (!typeIs(context.data, "table")) {
			context.addIssue({
				type: "invalidType",
				error: this._invalidType,
			});
		}
	}

	protected process(context: ParseContext<T>) {
		for (const [key, schema] of pairs(this.shape) as IterableFunction<[PropertyKey, Schema]>) {
			const value = context.data[key];

			const result = schema.parseWithPath(value, [...context.path, key]);
			for (const issue of result.issues) {
				context.issues.push(issue);
			}

			(context.data as Dictionary)[key] = result.value;
		}
	}

	invalidType(error: ErrorMessage) {
		this._invalidType = error;
		return this;
	}
}

// @ts-expect-error interface is a reserved keyword, but need this for compatibility with @rbxts/t
export const interface = factory.constructor(InterfaceSchema);
