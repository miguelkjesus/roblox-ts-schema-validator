import ParseContext from "./parse-context";

type ErrorMessage<T = unknown> = string | ((context: ParseContext) => string);

namespace ErrorMessage {
	export function resolve<T>(error: ErrorMessage, context: ParseContext) {
		return typeIs(error, "string") ? error : error(context);
	}

	export function implement<T>(error: ErrorMessage<T>) {
		return error;
	}
}

export default ErrorMessage;
