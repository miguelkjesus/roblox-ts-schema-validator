import { trim, trimEnd, trimStart } from "@rbxts/string-utils";

import { ParseContext } from "helpers/parse-context";
import { ErrorMessage } from "helpers/error-message";
import { CommonErrorMessages } from "helpers/common-error-messages";

import { Schema } from "./schema";
import { Factory } from "helpers/factories";

export class StringSchema extends Schema<string> {
	private _coerce = false;
	private _invalidType = CommonErrorMessages.expectedType("string");

	protected preprocess(context: ParseContext) {
		if (this._coerce) {
			context.data = tostring(context.data);
		}

		if (!typeIs(context.data, "string")) {
			context.addIssue({
				type: "invalidType",
				message: this._invalidType,
			});
		}
	}

	coerce() {
		this._coerce = true;
		return this;
	}

	invalidType(message: ErrorMessage) {
		this._invalidType = message;
		return this;
	}

	// Checkers

	minLength(min: number, message?: ErrorMessage<string>) {
		return this.use((ctx) => {
			const length = ctx.data.size();
			if (length >= min) return;

			ctx.addIssue({
				type: "tooSmall",
				message: message ?? CommonErrorMessages.tooShortString(min),
				inclusive: true,
				min,
			});
		});
	}

	min(...args: Parameters<typeof this.minLength>) {
		return this.minLength(...args);
	}

	maxLength(max: number, message?: ErrorMessage<string>) {
		return this.use((ctx) => {
			const length = ctx.data.size();
			if (length >= max) return;

			ctx.addIssue({
				type: "tooSmall",
				message: message ?? CommonErrorMessages.tooLongString(max),
				inclusive: true,
				max,
			});
		});
	}

	max(...args: Parameters<typeof this.maxLength>) {
		return this.maxLength(...args);
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
}

const stringConstructor = Factory.schema(StringSchema);
export { stringConstructor as string };
