import { PropertyKey } from "helpers/types";

export interface Base<T = unknown> {
	type: string;
	error: string;
	recieved: T;
	path: readonly PropertyKey[];
}

export interface Custom<T = unknown> extends Base<T> {
	type: "custom";
}

export interface InvalidType<T = unknown> extends Base<T> {
	type: "invalidType";
	expected: string;
}

export interface InvalidInstance<T = unknown> extends Base<T> {
	type: "invalidInstance";
	expected: string;
}

export interface InvalidLiteral<T = unknown> extends Base<T> {
	type: "invalidLiteral";
	expected: unknown;
}

export interface TooSmall<T = unknown> extends Base<T> {
	type: "tooSmall";
	min: number;
	inclusive: boolean;
}

export interface TooBig<T = unknown> extends Base<T> {
	type: "tooBig";
	max: number;
	inclusive: boolean;
}

export interface Required<T = unknown> extends Base<T> {
	type: "required";
}

export type Core<T = unknown> =
	| Custom<T>
	| InvalidType<T>
	| InvalidInstance<T>
	| InvalidLiteral<T>
	| TooSmall<T>
	| TooBig<T>
	| Required<T>;
