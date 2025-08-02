import { ParseContext } from "helpers/parse-context";
import { ParseResult } from "helpers/parse-result";

import { Schema } from "./schema";
import { Factory } from "helpers/factories";

export class OptionalSchema<T> extends Schema<T | undefined> {
	private schema: Schema<T>;

	constructor(schema: Schema<T>) {
		super();
		this.schema = schema;

		if (schema["~isAsync"]) {
			this["~isAsync"] = true;
		}
	}

	protected preprocess(context: ParseContext<unknown>): void {
		if (context.data === undefined) return;
	}

	protected process(context: ParseContext<T | undefined>): void {
		if (context.data === undefined) return;

		if (this.schema["~isAsync"]) {
			this.useAsync(async (ctx) => {
				await this.validateWrappedSchema(ctx);
			});
		} else {
			this.validateWrappedSchema(context);
		}
	}

	private validateWrappedSchema(context: ParseContext<T | undefined>): void | Promise<void> {
		const result = this.schema.parseWithPath(context.data, context.path);

		if (Promise.is(result)) {
			return result.then((parseResult) => {
				this.applyValidationResult(context, parseResult);
			});
		} else {
			this.applyValidationResult(context, result);
		}
	}

	private applyValidationResult(context: ParseContext<T | undefined>, result: ParseResult<Schema<T>>): void {
		for (const issue of result.issues) {
			context.issues.push(issue);
		}

		context.data = result.value as T | undefined;
	}
}

export const optional = Factory.schema(OptionalSchema);
