import { trim, trimEnd, trimStart } from "@rbxts/string-utils";

import ParseContext from "helpers/parse-context";
import ErrorMessage from "helpers/error-message";
import factory from "helpers/factories";

import Schema from "./schema";
import { OptionalSchema } from "./optional";

export class StringSchema extends Schema<string> {
	private _coerce = false;
	private _invalidType = ErrorMessage.implement(({ data }) => `Expected string, recieved ${typeOf(data)}`);

	protected preprocess(context: ParseContext) {
		if (this._coerce) {
			context.data = tostring(context.data);
		}

		if (!typeIs(context.data, "string")) {
			context.addIssue({
				type: "invalidType",
				error: this._invalidType,
			});
		}
	}

	coerce() {
		this._coerce = true;
		return this;
	}

	invalidType(error: ErrorMessage) {
		this._invalidType = error;
		return this;
	}

	// Checkers

	minLength(min: number, error?: ErrorMessage<string>) {
		return this.use((ctx) => {
			const length = ctx.data.size();
			if (length >= min) return;

			ctx.addIssue({
				type: "tooSmall",
				error: error ?? `Expected string to be at least ${min} characters long, recieved ${length}`,
				inclusive: true,
				min,
			});
		});
	}

	maxLength(max: number, error?: ErrorMessage<string>) {
		return this.use((ctx) => {
			const length = ctx.data.size();
			if (length >= max) return;

			ctx.addIssue({
				type: "tooSmall",
				error: error ?? `Expected string to be at most ${max} characters long, recieved ${length}`,
				inclusive: true,
				max,
			});
		});
	}

	// Transformers

	trim() {
		return this.transform(trim);
	}

	trimStart() {
		return this.transform(trimStart);
	}

	trimEnd() {
		return this.transform(trimEnd);
	}

	optional() {
		return new OptionalSchema(this);
	}
}

export const string = factory.constructor(StringSchema);
