import { ParseContext } from "helpers/parse-context";
import { ErrorMessage } from "helpers/error-message";
import { Factory } from "helpers/factories";

import { Schema } from "./schema";
import { CommonErrorMessages } from "helpers/common-error-messages";

export class EnumSchema<const T extends readonly [defined, ...defined[]]> extends Schema<T[number]> {
	private readonly values: T;

	private invalidEnumValueError?: ErrorMessage;

	constructor(values: T) {
		super();
		this.values = values;
	}

	protected preprocess(context: ParseContext) {
		let found = false;
		for (const value of this.values) {
			if (value === context.data) {
				found = true;
				break;
			}
		}
		if (!found) {
			context.addIssue({
				type: "invalidEnumValue",
				message: this.invalidEnumValueError ?? CommonErrorMessages.expectedEnum(this.values),
				expected: this.values,
			});
		}
	}

	invalidEnumValue(message: ErrorMessage) {
		this.invalidEnumValueError = message;
		return this;
	}
}

const enumOf = Factory.schema(EnumSchema);
export { enumOf as enum };
