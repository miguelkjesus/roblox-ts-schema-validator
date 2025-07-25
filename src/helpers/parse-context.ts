import ErrorMessage from "./error-message";
import Issue from "./issue";
import { ParseResult } from "./parse-result";
import { isEmpty } from "./table";
import { PropertyKey, Suggest } from "./types";

export type IssueParams<T> =
	Issue.Core<T> extends infer U
		? U extends Issue.Base<T>
			? Omit<U, "recieved" | "path" | "message" | "type"> & { type: Suggest<U["type"]>; message: ErrorMessage<T> }
			: never
		: never;

export type ParseContextCallback<T> = (context: ParseContext<T>) => void | Promise<void>;

export default class ParseContext<T = unknown> {
	data: T;
	readonly issues: Issue.Base<unknown>[] = [];
	readonly path: readonly PropertyKey[];

	constructor(data: T, path: readonly PropertyKey[]) {
		this.data = data;
		this.path = path;
	}

	success() {
		return isEmpty(this.issues);
	}

	addIssue<U, I extends IssueParams<U>>(issue: I) {
		this.issues.push({
			...issue,
			recieved: this.data,
			path: this.path,
			message: ErrorMessage.resolve(issue.message, this),
		});
	}

	toParseResult() {
		return new ParseResult(this.data, this.issues);
	}
}
