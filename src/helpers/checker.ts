// Checker

export type Checker<Input = unknown> = (data: Input) => CheckResult;
export function checker<Input>(func: Checker<Input>) {
	return func;
}

export type CheckerFactory<Input = unknown, Args extends unknown[] = unknown[]> = (...args: Args) => Checker<Input>;
checker.factory = <Input, Args extends unknown[]>(func: CheckerFactory<Input, Args>) => func;

// Result

export interface CheckResult {
	success: boolean;
	message?: string;
}

checker.result = (success: boolean, message?: string): CheckResult => ({ success, message });
checker.fail = (message?: string) => checker.result(false, message);
checker.success = () => checker.result(true);

// Common options

export interface CheckMessageOptions {
	message?: string;
}
