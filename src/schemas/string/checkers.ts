import { checker } from "helpers/checker";

export const max = checker.factory((value: number, inclusive: boolean, message?: string) => (data: string) => {
	const length = data.size();

	if (inclusive) {
		if (length > value) {
			return checker.fail(message ?? `Expected a string > ${value}`);
		}
	} else if (length >= value) {
		return checker.fail(message ?? `Expected a string >= ${value}`);
	}

	return checker.success();
});

export const min = checker.factory((value: number, inclusive: boolean, message?: string) => (data: string) => {
	const length = data.size();

	if (inclusive) {
		if (length < value) {
			return checker.fail(message ?? `Expected a string < ${value}`);
		}
	} else if (length <= value) {
		return checker.fail(message ?? `Expected a string <= ${value}`);
	}

	return checker.success();
});
