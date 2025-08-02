import { Schema } from "schemas";
import { conditional } from "./types";

export type infer<T> = T extends { "~type": unknown } ? T["~type"] : never;

export type sync<T> = T & { "~isAsync": false };
export type async<T> = T & { "~isAsync": true };

export type isAsync<T> = T extends { "~isAsync": infer V } ? V : never;
export function isAsync<T extends Schema>(schema: T) {
	return schema["~isAsync"];
}

export type PropogateAsync<From, To> = conditional<isAsync<From>, async<To>, sync<To>, To>;
