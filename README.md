# Roblox-ts schema validator (very catchy i know) (accepting alternative names)

A runtime type-checking library for roblox-ts, inspired by Zod. It provides declarative schema validation with TypeScript type inference that compiles to Luau.

## Basic Usage

```typescript
// Define a schema
const CustomServerOptions = r.interface({
	title: r.string().trim().min(3, "Server title too short").max(50, "Server title too long"),
	capacity: r.number().min(1).max(8),
	joinPermissions: r.enum(["all", "friendsOnly", "inviteOnly"]),
});

// Infer TypeScript type
type CustomServerOptions = r.infer<typeof UserSchema>;
// Result: { title: string; capacity: number; joinPermissions: "all" | "friendsOnly" | "inviteOnly" }

// Validate data (e.g. in a remote event/function)
TryCreateServer.OnServerInvoke = (player, args) => {
	const { value, success, issues } = CustomServerOptions.parse(args);

	if (!success) {
		return issues;
	}

	// ...
} 
```
