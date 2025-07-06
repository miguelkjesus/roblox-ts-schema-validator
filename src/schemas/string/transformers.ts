import { transformer } from "helpers/transformer";

function isWhitespaceAt(text: string, pos: number): boolean {
	const char = text.sub(pos, pos);
	return char === " " || char === "\t" || char === "\n" || char === "\r" || char === "\f" || char === "\v";
}

export const trim = transformer((data: string) => {
	let start = 0;
	let end = data.size() - 1;

	while (start <= end && isWhitespaceAt(data, start)) {
		start++;
	}

	while (end >= start && isWhitespaceAt(data, end)) {
		end--;
	}

	if (start > end) {
		return "";
	}

	return data.sub(start, end + 1);
});

export const trimStart = transformer((data: string) => {
	let start = 0;
	const end = data.size() - 1;

	while (start <= end && isWhitespaceAt(data, start)) {
		start++;
	}

	return data.sub(start);
});

export const trimEnd = transformer((data: string) => {
	const start = 0;
	let end = data.size() - 1;

	while (end >= start && isWhitespaceAt(data, end)) {
		end--;
	}

	if (start > end) {
		return "";
	}

	return data.sub(0, end + 1);
});
