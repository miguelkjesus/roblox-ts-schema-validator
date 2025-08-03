import { ParseContext } from "helpers/parse-context";
import { ErrorMessage } from "helpers/error-message";
import { CommonErrorMessages } from "helpers/common-error-messages";

import { Schema } from "./schema";
import { Factory } from "helpers/factories";

export class NumberSchema extends Schema<number> {
	private _coerce = false;
	private _allowNan = false;
	private _invalidType = CommonErrorMessages.expectedType("number");
	private _notANumber = CommonErrorMessages.notANumber;

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

		if (!this._allowNan && context.data !== context.data) {
			context.addIssue({
				type: "notANumber",
				message: this._notANumber,
			});
		}
	}

	coerce() {
		this._coerce = true;
		return this;
	}

	allowNan() {
		this._allowNan = true;
		return this;
	}

	invalidType(message: ErrorMessage) {
		this._invalidType = message;
		return this;
	}

	nan(message?: ErrorMessage) {
		this._allowNan = false;
		if (message !== undefined) {
			this._notANumber = message;
		}
		return this;
	}

	// Validators

	private _min(minimum: number, inclusive = true, message?: ErrorMessage<number>) {
		return this.use((ctx) => {
			const valid = inclusive ? ctx.data >= minimum : ctx.data > minimum;
			if (valid) return;

			ctx.addIssue({
				type: "tooSmall",
				message: message ?? CommonErrorMessages.tooSmallNumber(minimum, inclusive),
				inclusive,
				min: minimum,
			});
		});
	}

	gt(value: number, message?: ErrorMessage<number>) {
		return this._min(value, false, message);
	}

	gte(value: number, message?: ErrorMessage<number>) {
		return this._min(value, true, message);
	}

	min(minimum: number, message?: ErrorMessage<number>) {
		return this.gte(minimum, message);
	}

	private _max(maximum: number, inclusive = true, message?: ErrorMessage<number>) {
		return this.use((ctx) => {
			const valid = inclusive ? ctx.data <= maximum : ctx.data < maximum;
			if (valid) return;

			ctx.addIssue({
				type: "tooBig",
				message: message ?? CommonErrorMessages.tooBigNumber(maximum, inclusive),
				inclusive,
				max: maximum,
			});
		});
	}

	lt(value: number, message?: ErrorMessage<number>) {
		return this._max(value, false, message);
	}

	lte(value: number, message?: ErrorMessage<number>) {
		return this._max(value, true, message);
	}

	max(minimum: number, message?: ErrorMessage<number>) {
		return this.lte(minimum, message);
	}

	integer(message?: ErrorMessage<number>) {
		return this.use((ctx) => {
			if (ctx.data % 1 === 0) return;

			ctx.addIssue({
				type: "notInteger",
				message: message ?? CommonErrorMessages.notInteger,
			});
		});
	}

	finite(message?: ErrorMessage<number>) {
		return this.use((ctx) => {
			if (math.huge !== ctx.data && -math.huge !== ctx.data && ctx.data === ctx.data) return;

			ctx.addIssue({
				type: "notFinite",
				message: message ?? CommonErrorMessages.notFinite,
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
}

const numberConstructor = Factory.schema(NumberSchema);
export { numberConstructor as number };
