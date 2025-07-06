import { CheckMessageOptions } from "helpers/checker";
import { factory } from "helpers/factory";
import { parseResult } from "helpers/parse";

import { Schema } from "../schema/schema";

import * as Checkers from "./checkers";
import * as Transformers from "./transformers";

export interface StringSchemaDef {
	coerce: boolean;
}

export class StringSchema extends Schema<string, StringSchemaDef> {
	readonly _def = {
		coerce: false,
	};

	protected _parse(data: unknown) {
		if (this._def.coerce) {
			data = tostring(data);
		}

		if (typeIs(data, "string")) {
			return parseResult.success(data);
		}

		return parseResult.fail("Input is not a string");
	}

	coerce(value = true) {
		this._def.coerce = value;
		return this;
	}

	// Checkers

	min(value: number, options: CheckMessageOptions = {}) {
		this.addCheck(Checkers.min(value, true, options.message));
		return this;
	}

	lt(value: number, options: CheckMessageOptions = {}) {
		this.addCheck(Checkers.min(value, false, options.message));
		return this;
	}

	max(value: number, options: CheckMessageOptions = {}) {
		this.addCheck(Checkers.max(value, true, options.message));
		return this;
	}

	gt(value: number, options: CheckMessageOptions = {}) {
		this.addCheck(Checkers.max(value, false, options.message));
		return this;
	}

	// Transformers

	trim() {
		this.addTransform(Transformers.trim);
		return this;
	}

	trimStart() {
		this.addTransform(Transformers.trimStart);
		return this;
	}

	trimEnd() {
		this.addTransform(Transformers.trimEnd);
		return this;
	}
}

export const string = factory.fromClass(StringSchema);
