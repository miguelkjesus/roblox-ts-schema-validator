import { ParseContext } from "./parse-context";

export type ErrorMessage<T = unknown> = string | ((context: ParseContext<T>) => string);

export namespace ErrorMessage {
	export function resolve<T>(message: ErrorMessage<T>, context: ParseContext<T>) {
		return typeIs(message, "string") ? message : message(context);
	}

	export function implement<T>(message: ErrorMessage<T>) {
		return message;
	}
}
