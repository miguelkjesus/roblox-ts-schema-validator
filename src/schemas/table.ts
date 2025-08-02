import { ErrorMessage } from "helpers/error-message";
import { ParseContext } from "helpers/parse-context";

import { Schema } from "./schema";
import { Factory } from "helpers/factories";

export class TableSchema extends Schema<object> {
	private _invalidType = ErrorMessage.implement(({ data }) => `Expected table, recieved ${data}`);

	protected preprocess(context: ParseContext) {
		if (!typeIs(context.data, "table")) {
			context.addIssue({
				type: "invalidType",
				message: this._invalidType,
			});
		}
	}

	invalidType(message: ErrorMessage) {
		this._invalidType = message;
		return this;
	}
}

const tableConstructor = Factory.schema(TableSchema);
export { tableConstructor as table };
