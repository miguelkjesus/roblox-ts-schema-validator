import ParseContext from "helpers/parse-context";

import Schema from "./schema";

export class OptionalSchema<T> extends Schema<T | undefined> {
	private schema: Schema<T>;

	constructor(schema: Schema<T>) {
		super();
		this.schema = schema;
	}

	protected preprocess(context: ParseContext<unknown>): void {
		if (context.data === undefined) {
			return;
		}

		const result = this.schema.parseWithPath(context.data, context.path);

		context.data = result.value;
		for (const issue of result.issues) {
			context.issues.push(issue);
		}
	}
}

export const optional = <T>(schema: Schema<T>) => new OptionalSchema(schema);
