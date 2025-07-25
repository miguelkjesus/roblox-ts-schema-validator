# @rbxts/rod

A runtime type-checking library built for roblox-ts, in roblox-ts. Inspired by zod.

Example usage

```ts
import r from "@rbxts/rod"

const UserSchema = r.interface({
    id: r.string(),
    money: r.number().min(0),
    nickname: r
        .string()
        .minLength(3, "Your nickname must be longer than 3 characters!"),
});

type User = r.infer<typeof UserSchema>;
// {
//   id: string;
//   money: number;
//   nickname: string;
// }

if (UserSchema.check(/* input */)) {
    console.log("Input is a user!")
}

UserSchema.assert(/* input */)
console.log("Input is a user!")

const result = UserSchema.parse(/* input */)
console.log(result.errors().join("\n"))
```
