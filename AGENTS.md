# Wally - Agent Guidelines

Wally is a CLI orchestrator for opencode that handles agent invocation with context replay.
This is a Bun-based TypeScript CLI tool.

## Build/Run/Test Commands

```bash
bun install                       # Install dependencies
bun run index.ts                  # Run the application
bun --hot index.ts                # Run with hot reload
bun test                          # Run all tests
bun test path/to/file.test.ts     # Run a single test file
bun test --filter "pattern"       # Run tests matching a pattern
bun test --coverage               # Run tests with coverage
bunx tsc --noEmit                 # Type check without emitting
```

## Runtime: Use Bun, Not Node.js

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun install` instead of `npm install` / `yarn` / `pnpm`
- Use `bunx <package>` instead of `npx <package>`
- Bun automatically loads `.env` files - do not use `dotenv`

## Bun APIs for CLI Tools

### CLI Argument Parsing

```typescript
import { parseArgs } from "util";

const { values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    prompt: { type: "string", short: "p" },
    check: { type: "string", short: "c" },
    "max-loops": { type: "string", default: "50" },
    verbose: { type: "boolean", short: "v", default: false },
  },
  allowPositionals: true,
});
```

### Running External Scripts Safely

```typescript
// Use Bun.spawn for full control over subprocesses
const proc = Bun.spawn(["./check-script.sh", arg1, arg2], {
  cwd: "/path/to/dir",
  env: { ...process.env, CUSTOM_VAR: "value" },
  stdout: "pipe",
  stderr: "pipe",
});

const exitCode = await proc.exited;
const stdout = await new Response(proc.stdout).text();
const stderr = await new Response(proc.stderr).text();
```

### HTTP Requests

```typescript
const response = await fetch("https://api.example.com/data", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ key: "value" }),
});
const data = await response.json();
```

### Server-Sent Events (SSE)

```typescript
const response = await fetch("https://api.example.com/stream");
const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (reader) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value, { stream: true });
  for (const line of chunk.split("\n")) {
    if (line.startsWith("data: ")) {
      const data = JSON.parse(line.slice(6));
      // Process SSE event
    }
  }
}
```

## TypeScript Configuration

Strict mode enabled with additional checks:

- `noUncheckedIndexedAccess` - Array/object access may be undefined
- `noFallthroughCasesInSwitch` - Prevent switch fallthrough
- `noImplicitOverride` - Require `override` keyword

## Code Style

### Imports (in order)

1. External imports (`node:`, `bun:`, packages)
2. Internal imports (relative paths)
3. Types/interfaces, then constants, then implementation

### Naming Conventions

- **Files**: `kebab-case.ts` (e.g., `script-runner.ts`)
- **Test files**: `*.test.ts` co-located with source
- **Types/Interfaces**: `PascalCase` (e.g., `CliOptions`)
- **Functions/Variables**: `camelCase` (e.g., `runScript`)
- **Constants**: `SCREAMING_SNAKE_CASE` for module-level
- **Booleans**: Prefix with `is`, `has`, `should`, `can`

### Style Rules

```typescript
// AVOID: unnecessary destructuring
const { value } = obj; // no
const value = obj.value; // yes

// AVOID: else statements - use early returns
if (error) {
  return handleError(error);
}
// continue with main logic

// AVOID: try/catch when .catch() suffices
const result = await operation().catch(() => undefined);

// PREFER: single-word variables where sensible
const log = Log.create(); // not: const logger = ...
const config = getConfig(); // not: const configuration = ...

// PREFER: Bun APIs over Node.js equivalents
const content = await Bun.file(path).text();
await Bun.write(path, data);
const exists = await Bun.file(path).exists();
```

### Error Handling

```typescript
class ScriptError extends Error {
  constructor(message: string, public exitCode: number) {
    super(message);
    this.name = "ScriptError";
  }
}

// Fail explicitly - no silent failures
const exitCode = await proc.exited;
if (exitCode !== 0) {
  throw new ScriptError(`Script failed`, exitCode);
}
```

### Testing

```typescript
import { test, expect, describe } from "bun:test";

describe("ScriptRunner", () => {
  test("returns exit code on success", async () => {
    const result = await runScript("./test-script.sh");
    expect(result.exitCode).toBe(0);
  });

  test("throws on script not found", async () => {
    expect(runScript("./nonexistent.sh")).rejects.toThrow();
  });
});
```

## General Guidelines

1. **Keep functions small** - Single responsibility, under 50 lines
2. **Prefer async/await** - Over callbacks or raw promises
3. **Use early returns** - Reduce nesting, fail fast
4. **Validate CLI inputs early** - Fail fast with clear error messages
5. **Explicit return types** - For public/exported functions
6. **Prefer `const`** - Use `let` only when reassignment is needed

## Project Structure

```
wally/
├── index.ts        # Entry point, CLI argument parsing
├── src/
│   ├── runner.ts   # Script execution logic
│   ├── client.ts   # HTTP/SSE client for opencode
│   └── types.ts    # Shared type definitions
├── *.test.ts       # Test files (co-located)
└── AGENTS.md       # This file
```
