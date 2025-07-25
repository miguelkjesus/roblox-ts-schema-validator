import Issue from "./issue";
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
