import ErrorMessage from "helpers/error-message";
import ParseContext from "helpers/parse-context";
import factory from "helpers/factories";

import Schema from "./schema";

export class TableSchema extends Schema<object> {
	private invalidTypeError = ErrorMessage.implement(({ data }) => `Expected table, recieved ${data}`);

	protected preprocess(context: ParseContext) {
		if (!typeIs(context.data, "table")) {
			context.addIssue({
				type: "invalidType",
				error: this.invalidTypeError,
			});
		}
	}

	invalidType(error: ErrorMessage) {
		this.invalidTypeError = error;
		return this;
	}
}

export const table = factory.constructor(TableSchema);
