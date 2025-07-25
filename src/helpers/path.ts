import { PropertyKey } from "./types";

export function formatPath(path: PropertyKey[]) {
	return path.map((value) => tostring(value)).join(".");
}
