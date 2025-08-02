# @rbxts/rod

A runtime type-checking library for roblox-ts, inspired by Zod. Rod provides declarative schema validation with TypeScript type inference that compiles to Luau.

## Installation

```bash
npm install @rbxts/rod
```

## Basic Usage

```typescript
import r from "@rbxts/rod";

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

## Common Patterns

### Remote Event Validation

```typescript
const PlayerActionSchema = r.interface({
	action: r.literal("jump"),
	playerId: r.string(),
	position: r.interface({
		x: r.number(),
		y: r.number(),
		z: r.number(),
	}),
});

// Server-side validation
remoteEvent.OnServerEvent.Connect((player, data) => {
	const result = PlayerActionSchema.parse(data);
	if (!result.success) {
		warn(`Invalid data from ${player.Name}: ${result.messages().join(", ")}`);
		return;
	}

	// data is now properly typed and validated
	handlePlayerAction(player, result.data);
});
```

### DataStore Validation

```typescript
const PlayerDataSchema = r.interface({
	level: r.number().min(1).integer(),
	coins: r.number().min(0),
	inventory: r
		.interface({
			items: r.string(),
			count: r.number().min(0),
		})
		.optional(),
});

// Safely load player data
const savedData = dataStore.GetAsync(player.UserId);
const result = PlayerDataSchema.parse(savedData);

if (result.success) {
	loadPlayerData(player, result.data);
} else {
	// Handle corrupted data gracefully
	loadDefaultPlayerData(player);
}
```

### Game Configuration

```typescript
const GameConfigSchema = r.interface({
	maxPlayers: r.number().min(1).max(50),
	gameMode: r.literal("survival"),
	settings: r.interface({
		pvpEnabled: r.string().optional(),
		difficulty: r.number().min(1).max(5),
	}),
});

// Validate configuration from external source
if (GameConfigSchema.check(configData)) {
	applyGameConfig(configData);
}
```
