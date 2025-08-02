import { ErrorMessage } from "./error-message";

const CommonErrorMessages = {
	required: ErrorMessage.implement(() => "Required field is missing"),

	notInteger: ErrorMessage.implement(({ data }) => `Expected integer, recieved ${data}`),

	notFinite: ErrorMessage.implement(({ data }) => `Expected finite number, recieved ${data}`),

	expectedType(expected: string) {
		return ErrorMessage.implement(({ data }) => `Expected ${expected}, recieved ${typeOf(data)}`);
	},

	expectedValue(expected: string) {
		return ErrorMessage.implement(({ data }) => `Expected ${expected}, recieved ${data}`);
	},

	expectedLiteral(expected: unknown) {
		return ErrorMessage.implement(({ data }) => `Expected ${expected}, recieved ${data}`);
	},

	tooShortString(min: number) {
		return ErrorMessage.implement<string>(
			({ data }) => `Expected string to be at least ${min} characters long, recieved ${data.size()}`,
		);
	},

	tooLongString(max: number) {
		return ErrorMessage.implement<string>(
			({ data }) => `Expected string to be at most ${max} characters long, recieved ${data.size()}`,
		);
	},

	tooSmallNumber(min: number, inclusive: boolean = true) {
		return ErrorMessage.implement<number>(
			({ data }) => `Expected number to be ${inclusive ? "at least" : "greater than"} ${min}, recieved ${data}`,
		);
	},

	tooBigNumber(max: number, inclusive: boolean = true) {
		return ErrorMessage.implement<number>(
			({ data }) => `Expected number to be ${inclusive ? "at most" : "less than"} ${max}, recieved ${data}`,
		);
	},

	expectedEnum(values: readonly unknown[]) {
		return ErrorMessage.implement(
			({ data }) => `Expected one of [${(values as defined[]).map((v) => `${v}`).join(", ")}], recieved ${data}`,
		);
	},
} as const;

type CommonErrorMessages = typeof CommonErrorMessages;

export { CommonErrorMessages };
