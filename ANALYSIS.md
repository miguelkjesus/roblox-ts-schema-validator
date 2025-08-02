# Rod Library Analysis - Critical Issues & Fixes Needed

## 🚨 Critical Issues

### 1. **Async Pipeline Bug** (CRITICAL)

**Location**: `src/schemas/schema.ts:40` and `57`

```typescript
// Line 40: Not awaited!
this.runPipeline(context);

// Line 57: Async method
private async runPipeline(context: ParseContext<T>) {
```

**Impact**: The `parseWithPath` method returns before the async pipeline completes, causing:

- Transformations may not be applied
- Refinements may not run
- Race conditions in validation results

**Proposed Fix**: Implement type-level async inference system

### 2. **Incorrect Error "Received" Values**

**Location**: `src/helpers/parse-context.ts:33`

```typescript
addIssue(issue: IssueParams<T>) {
    this.issues.push({
        recieved: this.data, // ❌ Shows transformed data, not original
```

**Impact**: Error messages show transformed values instead of original input

## ⚠️ Architectural Issues

### 3. **Data Mutation During Validation**

**Issues**:

- Coercion mutates data before type checking
- Transformations permanently alter context data
- Failed validations still return transformed data

### 4. **Interface Schema Value Assignment**

**Location**: `src/schemas/interface.ts:38`

```typescript
(context.data as Dictionary)[key] = result.value;
```

**Issue**: Always assigns `result.value` even when validation failed

## 🔍 Edge Cases & Potential Failures

### 5. **Number Schema NaN Handling**

**Issue**: The `ctx.data === ctx.data` check for NaN may not work correctly in Luau

### 6. **Coercion Edge Cases**

- String coercion of functions/userdata produces unhelpful representations
- Number coercion errors show "received nil" instead of original value

### 7. **Optional Schema Recursive Parsing**

**Issues**:

- Creates recursive parse contexts
- Potential performance impact
- Complex error propagation

### 8. **Circular Reference Vulnerability**

**Issue**: No circular reference detection could cause stack overflow

## 🧪 Critical Test Scenarios

### Test Case 1: Nested Optional with Transformations

```typescript
const schema = r.optional(
	r
		.string()
		.trim()
		.transform((s) => s.upper()),
);
// Input: "  hello  " vs undefined vs null
```

### Test Case 2: Failed Coercion Chain

```typescript
const schema = r.number().coerce().round().min(0);
// Input: function() end (Luau function)
```

### Test Case 3: Interface with Mixed Success/Failure

```typescript
const schema = r.interface({
	valid: r.string(),
	invalid: r.number(),
	optional: r.string().optional(),
});
// Input: { valid: "ok", invalid: "not a number", optional: undefined }
```

### Test Case 4: Deep Async Pipeline

```typescript
const schema = r
	.string()
	.refine(async (s) => await checkDatabase(s))
	.transform(async (s) => await processString(s));
```

### Test Case 5: Large Object Performance

Test with 10,000+ properties to check performance characteristics

## 💡 Immediate Fixes Required

### Priority 1 (Critical):

1. **Fix async pipeline with type inference**
2. **Preserve original data for error reporting**
3. **Add circular reference detection**

### Priority 2 (High):

1. **Fix interface value assignment logic**
2. **Improve coercion error messages**
3. **Add NaN handling for Luau**

### Priority 3 (Medium):

1. **Consider immutable validation approach**
2. **Add performance optimizations**
3. **Implement validation limits**

## ✅ IMPLEMENTED: Async Type Inference System

### What Was Fixed:

1. **Automatic Async Detection**: `parse()` now automatically returns `Promise<ParseResult<T>>` when schema has async operations
2. **Type-Level Inference**: TypeScript automatically knows when you need to `await` the result
3. **Original Data Preservation**: Error messages now show original input, not transformed data
4. **Separate Async Methods**: `refineAsync()` and `transformAsync()` for explicit async operations

### New API:

```typescript
// Sync schema - returns ParseResult<T>
const syncSchema = r.string().trim();
const result = syncSchema.parse("hello"); // No await needed

// Async schema - returns Promise<ParseResult<T>>
const asyncSchema = r.string().refineAsync(async (s) => await checkDatabase(s));
const result = await asyncSchema.parse("hello"); // Must await!

// TypeScript will error if you forget to await async schemas
```

### Remaining Issues to Fix:

1. **Interface Schema Value Assignment** - Still assigns failed results
2. **Circular Reference Detection** - Not yet implemented
3. **Coercion Error Messages** - Still show transformed values in some cases
4. **Schema Subclass Updates** - Need to add async type parameters

## Notes

- Main async bug is now FIXED ✅
- Error reporting improved ✅
- Type safety dramatically improved ✅
- Performance testing still needed with large objects and deep nesting
