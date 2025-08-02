# Roblox-ts schema validator (very catchy i know) (accepting alternative names)

A runtime type-checking library for roblox-ts, inspired by Zod. It provides declarative schema validation with TypeScript type inference that compiles to Luau.

## Basic Usage

```typescript
// Define a schema
const UserSchema = r.interface({
	id: r.string(),
	username: r.string().minLength(3),
	age: r.number().min(13).max(120),
	premium: r.string().optional(),
});

// Infer TypeScript type
type User = r.infer<typeof UserSchema>;
// Result: { id: string; username: string; age: number; premium?: string }

// Validate data
const result = UserSchema.parse(someUserData);
if (result.success) {
	print("Valid user:", result.data.username);
} else {
	print("Errors:", result.messages().join(", "));
}
```
