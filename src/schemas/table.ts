import ErrorMessage from "helpers/error-message";
import ParseContext from "helpers/parse-context";
import factory from "helpers/factories";

import Schema from "./schema";

export class TableSchema extends Schema<object> {
	private _invalidType = ErrorMessage.implement(({ data }) => `Expected table, recieved ${data}`);

	protected preprocess(context: ParseContext) {
		if (!typeIs(context.data, "table")) {
			context.addIssue({
				type: "invalidType",
				error: this._invalidType,
			});
		}
	}

	invalidType(error: ErrorMessage) {
		this._invalidType = error;
		return this;
	}
}

export const table = factory.constructor(TableSchema);
