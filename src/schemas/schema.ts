import ParseContext, { ParseContextCallback } from "helpers/parse-context";
import ErrorMessage from "helpers/error-message";
import { PropertyKey } from "helpers/types";

export type infer<T extends { $type: unknown }> = T["$type"];

export default abstract class Schema<T = unknown> {
	readonly $type!: T;
	description?: string;

	private pipeline: ParseContextCallback<T>[] = [];

	protected abstract preprocess(context: ParseContext<unknown>): void;
	protected process(context: ParseContext<T>) {}

	private isValidInput(context: ParseContext<unknown>): context is ParseContext<T> {
		this.preprocess(context);
		return context.success();
	}

	parseWithPath(data: unknown, path: readonly PropertyKey[]) {
		const context = new ParseContext(data, path);

		if (!this.isValidInput(context)) {
			return context.toParseResult();
		}

		this.process(context);
		this.runPipeline(context);
		return context.toParseResult();
	}

	parse(data: unknown) {
		return this.parseWithPath(data, []);
	}

	check(data: unknown): data is T {
		return this.parse(data).success;
	}

	assert(data: unknown): asserts data is T {
		const result = this.parse(data);
		assert(result.success, result.messages().join("\n"));
	}

	private async runPipeline(context: ParseContext<T>) {
		for (const step of this.pipeline) {
			if (!context.success()) return;
			await step(context);
		}
	}

	use(stage: ParseContextCallback<T>) {
		this.pipeline.push(stage);
		return this;
	}

	refine(validate: (data: T) => boolean, error: ErrorMessage<T> = "") {
		return this.use((context) => {
			if (!validate(context.data)) {
				context.addIssue({ type: "custom", error });
			}
		});
	}

	transform(transform: (data: T) => T) {
		return this.use((context) => {
			context.data = transform(context.data);
		});
	}

	describe(description: string) {
		this.description = description;
		return this;
	}

	implement(value: T): T {
		return value;
	}
}
