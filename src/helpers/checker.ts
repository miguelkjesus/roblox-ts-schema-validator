import ParseContext from "./parse-context";

type Checker<T> = (context: ParseContext<T>) => void | Promise<void>;

export default Checker;
