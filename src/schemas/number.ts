import ParseContext from "helpers/parse-context";
import ErrorMessage from "helpers/error-message";
import CommonErrors from "helpers/common-errors";
import factory from "helpers/factories";

import Schema from "./schema";
import { OptionalSchema } from "./optional";

export class NumberSchema extends Schema<number> {
	private _coerce = false;
	private _invalidType = CommonErrors.expectedType("number");

	protected preprocess(context: ParseContext) {
		if (this._coerce) {
			context.data = tonumber(context.data);
		}

		if (!typeIs(context.data, "number")) {
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

	// Validators

	min(minimum: number, inclusive = true, message?: ErrorMessage<number>) {
		return this.use((ctx) => {
			const valid = inclusive ? ctx.data >= minimum : ctx.data > minimum;
			if (valid) return;

			ctx.addIssue({
				type: "tooSmall",
				message: message ?? CommonErrors.tooSmallNumber(minimum, inclusive),
				inclusive,
				min: minimum,
			});
		});
	}

	max(maximum: number, inclusive = true, message?: ErrorMessage<number>) {
		return this.use((ctx) => {
			const valid = inclusive ? ctx.data <= maximum : ctx.data < maximum;
			if (valid) return;

			ctx.addIssue({
				type: "tooBig",
				message: message ?? CommonErrors.tooBigNumber(maximum, inclusive),
				inclusive,
				max: maximum,
			});
		});
	}

	integer(message?: ErrorMessage<number>) {
		return this.use((ctx) => {
			if (ctx.data % 1 === 0) return;

			ctx.addIssue({
				type: "notInteger",
				message: message ?? CommonErrors.notInteger(),
			});
		});
	}

	finite(message?: ErrorMessage<number>) {
		return this.use((ctx) => {
			if (math.huge !== ctx.data && -math.huge !== ctx.data && ctx.data === ctx.data) return;

			ctx.addIssue({
				type: "notFinite",
				message: message ?? CommonErrors.notFinite(),
			});
		});
	}

	// Transformers

	round() {
		return this.transform((data) => math.floor(data + 0.5));
	}

	floor() {
		return this.transform(math.floor);
	}

	ceil() {
		return this.transform(math.ceil);
	}

	abs() {
		return this.transform(math.abs);
	}

	optional() {
		return new OptionalSchema(this);
	}
}

const numberConstructor = factory.constructor(NumberSchema);
export { numberConstructor as number };
