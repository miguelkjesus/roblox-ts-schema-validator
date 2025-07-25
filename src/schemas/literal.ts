import ParseContext from "helpers/parse-context";
import ErrorMessage from "helpers/error-message";
import factory from "helpers/factories";

import Schema from "./schema";

export class LiteralSchema<const T> extends Schema<T> {
	private readonly value: T;

	private invalidLiteralError = ErrorMessage.implement((ctx) => `Expected ${this.value}, recieved ${ctx.data}.`);

	constructor(value: T) {
		super();
		this.value = value;
	}

	protected preprocess(context: ParseContext) {
		if (context.data !== this.value) {
			context.addIssue({
				type: "invalidLiteral",
				message: this.invalidLiteralError,
			});
		}
	}

	invalidLiteral(message: ErrorMessage) {
		this.invalidLiteralError = message;
		return this;
	}
}

export const literal = factory.constructor(LiteralSchema);
