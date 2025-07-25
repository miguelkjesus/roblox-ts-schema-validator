import ErrorMessage from "./error-message";

const CommonErrors = {
	expectedType: (expected: string) =>
		ErrorMessage.implement(({ data }) => `Expected ${expected}, recieved ${typeOf(data)}`),

	expectedValue: (expected: string) => ErrorMessage.implement(({ data }) => `Expected ${expected}, recieved ${data}`),

	expectedLiteral: (expected: unknown) =>
		ErrorMessage.implement(({ data }) => `Expected ${expected}, recieved ${data}`),

	required: () => ErrorMessage.implement(() => "Required field is missing"),

	tooShortString: (min: number) =>
		ErrorMessage.implement(
			({ data }) => `Expected string to be at least ${min} characters long, recieved ${(data as string).size()}`,
		),

	tooLongString: (max: number) =>
		ErrorMessage.implement(
			({ data }) => `Expected string to be at most ${max} characters long, recieved ${(data as string).size()}`,
		),

	tooSmallNumber: (min: number, inclusive = true) =>
		ErrorMessage.implement(
			({ data }) => `Expected number to be ${inclusive ? "at least" : "greater than"} ${min}, recieved ${data}`,
		),

	tooBigNumber: (max: number, inclusive = true) =>
		ErrorMessage.implement(
			({ data }) => `Expected number to be ${inclusive ? "at most" : "less than"} ${max}, recieved ${data}`,
		),

	notInteger: () => ErrorMessage.implement(({ data }) => `Expected integer, recieved ${data}`),

	notFinite: () => ErrorMessage.implement(({ data }) => `Expected finite number, recieved ${data}`),
};

export default CommonErrors;
