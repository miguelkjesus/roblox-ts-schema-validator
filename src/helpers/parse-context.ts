import { ErrorMessage } from "./error-message";
import { Issue } from "./issue";
import { ParseResult } from "./parse-result";
import { isEmpty } from "./table";
import { conditional, PropertyKey, Suggest } from "./types";

export type IssueParams = Issue.Core extends infer U
	? U extends Issue.Base
		? Omit<U, "recieved" | "path" | "message" | "type"> & {
				type: Suggest<U["type"]>;
				message: ErrorMessage<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
			}
		: never
	: never;

export type ParseContextCallback<T, isAsync extends boolean = boolean> = (
	context: ParseContext<T>,
) => conditional<isAsync, Promise<void>, void>;
export type AsyncParseContextCallback<T> = (context: ParseContext<T>) => Promise<void>;
export type SyncParseContextCallback<T> = (context: ParseContext<T>) => void;

export class ParseContext<T = unknown> {
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

	addIssue<I extends IssueParams>(issue: I) {
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
