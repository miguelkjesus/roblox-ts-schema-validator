import { checker, Checker } from "helpers/checker";
import { parseResult, ParseResult } from "helpers/parse";
import { Transformer } from "helpers/transformer";

export interface SchemaCheck<Kind extends string = string, Args extends unknown[] = unknown[]> {
	kind: Kind;
	args: Args;
}

export type SchemaStep<T> = { kind: "check"; check: Checker<T> } | { kind: "transform"; transform: Transformer<T> };

export abstract class Schema<T = unknown, Def extends object = object> {
	readonly $type!: T;
	abstract readonly _def: Def;
	description?: string;

	protected steps: SchemaStep<T>[] = [];

	protected addCheck(check: Checker<T>) {
		this.steps.push({ kind: "check", check });
	}

	protected addTransform(transform: Transformer<T>) {
		this.steps.push({ kind: "transform", transform });
	}

	protected abstract _parse(data: unknown): ParseResult<T>;

	parse(data: unknown) {
		let result = this._parse(data);
		result = this.runSteps(result);

		if (!result.success) delete result.data;
		return result;
	}

	protected runSteps(result: ParseResult<T>) {
		for (const step of this.steps) {
			if (!result.success) return result;

			if (step.kind === "check") {
				result = this.runCheck(result, step.check);
			} else if (step.kind === "transform") {
				this.runTransform(result, step.transform);
			}
		}

		return result;
	}

	protected runCheck(result: ParseResult<T>, check: Checker<T>) {
		const checkResult = check(result.data!);

		if (checkResult.message !== undefined) {
			result.messages.push(checkResult.message);
		}

		if (!checkResult.success) {
			result = parseResult.failed(result);
		}

		return result;
	}

	protected runTransform(result: ParseResult<T>, transform: Transformer<T>) {
		result.data = transform(result.data!);
	}

	refine(func: (data: T) => boolean, message?: string) {
		this.addCheck((data) => (func(data) ? checker.success() : checker.fail(message)));
	}

	describe(description: string) {
		this.description = description;
	}
}
