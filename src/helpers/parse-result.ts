import { Issue } from "./issue";
import { isAsync } from "./schema-types";
import { isEmpty } from "./table";

export class ParseResult<T = unknown> {
	readonly value: T;
	readonly issues: readonly Issue.Base<T>[];
	readonly success: boolean;

	constructor(value: T, issues: readonly Issue.Base<T>[]) {
		this.value = value;
		this.issues = issues;
		this.success = isEmpty(issues);
	}

	messages() {
		return this.issues.map((issue) => issue.message);
	}
}

export type MaybeAsyncParseResult<T> =
	isAsync<T> extends true
		? Promise<ParseResult<T>>
		: isAsync<T> extends false
			? ParseResult<T>
			: Promise<ParseResult<T>> | ParseResult<T>;
