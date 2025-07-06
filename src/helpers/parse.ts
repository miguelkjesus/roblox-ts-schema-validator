export type FieldParseMessages = string[] | RecordOfParseMessages;
interface RecordOfParseMessages {
	readonly [key: string]: FieldParseMessages;
}

export interface ParseContext {
	readonly success: boolean;
	readonly path: (string | number)[];
	readonly fieldMessages: FieldParseMessages;
	readonly messages: string[];
}

export interface ParseSuccess<T> {
	success: true;
	data: T;
	messages: string[];
}

export interface ParseFail {
	success: false;
	data?: never;
	messages: string[];
}

export type ParseResult<T> = ParseSuccess<T> | ParseFail;

export const parseResult = {
	success<T>(data: T, ...messages: string[]): ParseSuccess<T> {
		return { success: true, data, messages };
	},
	fail(...messages: string[]): ParseFail {
		return { success: false, messages };
	},
	failed<T>(previous: ParseResult<T>) {
		previous.success = false;
		delete previous.data;
		return previous as ParseFail;
	},
};
