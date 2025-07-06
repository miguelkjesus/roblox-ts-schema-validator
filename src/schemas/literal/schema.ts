import { factory } from "helpers/factory";
import { parseResult } from "helpers/parse";

import { Schema } from "../schema/schema";

export class LiteralSchema<const T> extends Schema<T, object> {
	readonly _def = {};
	private value: T;

	constructor(value: T) {
		super();
		this.value = value;
	}

	protected _parse(data: unknown) {
		if (this.value === data) {
			return parseResult.success(this.value);
		}

		return parseResult.fail(`Expected ${tostring(this.value)}`);
	}
}

export const literal = factory.fromClass(LiteralSchema);
