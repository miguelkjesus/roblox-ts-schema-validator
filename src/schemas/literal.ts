import { ParseContext } from "helpers/parse-context";
import { ErrorMessage } from "helpers/error-message";
import { Factory } from "helpers/factories";

import { Schema } from "./schema";
import { CommonErrorMessages } from "helpers/common-error-messages";

export class LiteralSchema<const T> extends Schema<T> {
	private readonly value: T;

	private invalidLiteralError?: ErrorMessage;

	constructor(value: T) {
		super();
		this.value = value;
	}

	protected preprocess(context: ParseContext) {
		if (context.data !== this.value) {
			context.addIssue({
				type: "invalidLiteral",
				message: this.invalidLiteralError ?? CommonErrorMessages.expectedLiteral(this.value),
			});
		}
	}

	invalidLiteral(message: ErrorMessage) {
		this.invalidLiteralError = message;
		return this;
	}
}

export const literal = Factory.schema(LiteralSchema);
