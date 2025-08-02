import {
	ParseContext,
	AsyncParseContextCallback,
	ParseContextCallback,
	SyncParseContextCallback,
} from "helpers/parse-context";
import { ErrorMessage } from "helpers/error-message";
import { CommonErrorMessages } from "helpers/common-error-messages";
import { PropertyKey } from "helpers/types";
import { MaybeAsyncParseResult } from "helpers/parse-result";
import { async } from "helpers/schema-types";
import { OptionalSchema } from "external";

export abstract class Schema<T = unknown> {
	readonly "~type"!: T;
	"~isAsync" = false;

	description?: string;

	private pipeline: ParseContextCallback<T>[] = [];
	private _required = CommonErrorMessages.required;

	protected abstract preprocess(context: ParseContext<unknown>): void;
	protected process(context: ParseContext<T>) {}

	private isValidInput(context: ParseContext<unknown>): context is ParseContext<T> {
		if (context.data === undefined) {
			context.addIssue({
				type: "required",
				message: this._required,
			});
			return false;
		}

		this.preprocess(context);
		return context.success();
	}

	parseWithPath(data: unknown, path: readonly PropertyKey[]): MaybeAsyncParseResult<this> {
		const context = new ParseContext(data, path);

		if (!this.isValidInput(context)) {
			return context.toParseResult() as MaybeAsyncParseResult<this>;
		}

		this.process(context);

		if (this["~isAsync"]) {
			return this.runPipelineAsync(context).then(() => context.toParseResult()) as MaybeAsyncParseResult<this>;
		} else {
			this.runPipelineSync(context);
			return context.toParseResult() as MaybeAsyncParseResult<this>;
		}
	}

	parse(data: unknown) {
		return this.parseWithPath(data, []);
	}

	private asAsync() {
		this["~isAsync"] = true;
		return this as async<this>;
	}

	private runPipelineSync(context: ParseContext<T>) {
		for (const step of this.pipeline) {
			if (!context.success()) return;
			step(context);
		}
	}

	private async runPipelineAsync(context: ParseContext<T>) {
		for (const step of this.pipeline) {
			if (!context.success()) return;
			await step(context);
		}
	}

	use(stage: SyncParseContextCallback<T>) {
		this.pipeline.push(stage);
		return this;
	}

	useAsync(stage: AsyncParseContextCallback<T>) {
		return this.use(stage).asAsync();
	}

	refine(validate: (data: T) => boolean, message: ErrorMessage<T> = "") {
		return this.use((context) => {
			const result = validate(context.data);
			if (!result) {
				context.addIssue({ type: "custom", message });
			}
		});
	}

	refineAsync(validate: (data: T) => Promise<boolean>, message: ErrorMessage<T> = "") {
		return this.useAsync(async (context) => {
			const result = await validate(context.data);
			if (!result) {
				context.addIssue({ type: "custom", message });
			}
		});
	}

	transform(transformer: (data: T) => T) {
		return this.use((context) => {
			const result = transformer(context.data);
			context.data = result;
		});
	}

	transformAsync(transformer: (data: T) => Promise<T>) {
		return this.useAsync(async (context) => {
			const result = (await transformer(context.data)) as T;
			context.data = result;
		});
	}

	describe(description: string) {
		this.description = description;
		return this;
	}

	required(message: ErrorMessage) {
		this._required = message;
		return this;
	}

	implement(value: T): T {
		return value;
	}

	optional() {
		return new OptionalSchema(this);
	}
}
