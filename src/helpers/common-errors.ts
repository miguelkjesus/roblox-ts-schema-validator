import ErrorMessage from "./error-message";

const CommonErrors = {
	expectedType: (expected: string) =>
		ErrorMessage.implement(({ data }) => `Expected ${expected}, recieved ${typeOf(data)}`),

	expectedValue: (expected: string) => ErrorMessage.implement(({ data }) => `Expected ${expected}, recieved ${data}`),

	expectedLiteral: (expected: unknown) =>
		ErrorMessage.implement(({ data }) => `Expected ${expected}, recieved ${data}`),

	required: () => ErrorMessage.implement(() => "Required field is missing"),

	tooShort: (min: number) =>
		ErrorMessage.implement(
			({ data }) => `Expected string to be at least ${min} characters long, recieved ${(data as string).size()}`,
		),

	tooLong: (max: number) =>
		ErrorMessage.implement(
			({ data }) => `Expected string to be at most ${max} characters long, recieved ${(data as string).size()}`,
		),
};

export default CommonErrors;
