import ParseContext from "./parse-context";

type ErrorMessage<T = unknown> = string | ((context: ParseContext) => string);

namespace ErrorMessage {
	export function resolve(message: ErrorMessage, context: ParseContext) {
		return typeIs(message, "string") ? message : message(context);
	}

	export function implement<T>(message: ErrorMessage<T>) {
		return message;
	}
}

export default ErrorMessage;
