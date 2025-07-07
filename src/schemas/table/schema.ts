import { factory } from "helpers/factory";
import { parseResult } from "helpers/parse";

import { Schema } from "../schema/schema";

export class TableSchema extends Schema<object, object> {
	readonly _def = {};

	protected _parse(data: unknown) {
		if (typeIs(data, "table")) {
			return parseResult.success(data);
		}

		return parseResult.fail(`Expected a table`);
	}
}

export const literal = factory.fromClass(TableSchema);
