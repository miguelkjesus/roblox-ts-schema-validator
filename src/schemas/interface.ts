import { ErrorMessage } from "helpers/error-message";
import { ParseContext } from "helpers/parse-context";
import { Dictionary, PropertyKey } from "helpers/types";

import { Schema } from "./schema";
import { Factory } from "helpers/factories";

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
				message: this._invalidType,
			});
		}
	}

	protected process(context: ParseContext<T>) {
		// Check if any schema is async and handle appropriately
		let hasAsync = false;
		for (const [, schema] of pairs(this.shape) as IterableFunction<[PropertyKey, Schema]>) {
			if (schema["~isAsync"]) {
				hasAsync = true;
				break;
			}
		}

		if (hasAsync) {
			// If any schema is async, we need to handle this in the async pipeline
			this.useAsync(async (ctx) => {
				for (const [key, schema] of pairs(this.shape) as IterableFunction<[PropertyKey, Schema]>) {
					const value = ctx.data[key];
					const result = await schema.parseWithPath(value, [...ctx.path, key]);

					if (result && typeIs(result, "table") && "issues" in result && "value" in result) {
						for (const issue of result.issues) {
							ctx.issues.push(issue);
						}
						(ctx.data as Dictionary)[key] = result.value;
					}
				}
			});
		} else {
			// All schemas are sync, handle synchronously
			for (const [key, schema] of pairs(this.shape) as IterableFunction<[PropertyKey, Schema]>) {
				const value = context.data[key];
				const result = schema.parseWithPath(value, [...context.path, key]);

				if (result && typeIs(result, "table") && "issues" in result && "value" in result) {
					for (const issue of result.issues) {
						context.issues.push(issue);
					}
					(context.data as Dictionary)[key] = result.value;
				}
			}
		}
	}

	invalidType(message: ErrorMessage) {
		this._invalidType = message;
		return this;
	}
}

const interfaceConstructor = Factory.schema(InterfaceSchema);
export { interfaceConstructor as interface };
