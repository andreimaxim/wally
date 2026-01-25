import { test, expect } from "bun:test"
import { runCommand, type ArgsDef } from "citty"
import { main } from "@/cli"

const args = main.args as ArgsDef
const testPromptPath = "test/fixtures/PROMPT.md"
const testCheckPath = "test/fixtures/check.sh"

test("defines --prompt option as required string with alias -p", () => {
    expect(args.prompt).toMatchObject({
        type: "string",
        required: true,
        alias: "p"
    })
})

test("defines --check option as required string with alias -c", () => {
    expect(args.check).toMatchObject({
        type: "string",
        required: true,
        alias: "c"
    })
})

test("defines --limit option as string with alias -l", () => {
    expect(args.limit).toMatchObject({
        type: "string",
        alias: "l"
    })
})

test("defines --wait option as string with alias -w", () => {
    expect(args.wait).toMatchObject({
        type: "string",
        alias: "w"
    })
})

test("defines --agent option as string with alias -a", () => {
    expect(args.agent).toMatchObject({
        type: "string",
        alias: "a"
    })
})

test("defines --model option as string with alias -m", () => {
    expect(args.model).toMatchObject({
        type: "string",
        alias: "m"
    })
})

test("reads prompt from --prompt flag", async () => {
    const result = await runCommand(main, {
        rawArgs: ["--prompt", testPromptPath, "--check", testCheckPath]
    })

    expect(result.result).toMatchObject({ prompt: testPromptPath })
})

test("reads prompt from -p alias", async () => {
    const result = await runCommand(main, {
        rawArgs: ["-p", testPromptPath, "--check", testCheckPath]
    })

    expect(result.result).toMatchObject({ prompt: testPromptPath })
})

test("reads check from --check flag", async () => {
    const result = await runCommand(main, {
        rawArgs: ["--prompt", testPromptPath, "--check", testCheckPath]
    })

    expect(result.result).toMatchObject({ check: testCheckPath })
})

test("reads check from -c alias", async () => {
    const result = await runCommand(main, {
        rawArgs: ["--prompt", testPromptPath, "-c", testCheckPath]
    })

    expect(result.result).toMatchObject({ check: testCheckPath })
})
test("reads limit from --limit flag", async () => {
    const result = await runCommand(main, {
        rawArgs: ["--prompt", testPromptPath, "--check", testCheckPath, "--limit", "5"]
    })

    expect(result.result).toMatchObject({ limit: 5 })
})

test("reads limit from -l alias", async () => {
    const result = await runCommand(main, {
        rawArgs: ["--prompt", testPromptPath, "--check", testCheckPath, "-l", "5"]
    })

    expect(result.result).toMatchObject({ limit: 5 })
})

test("reads wait from --wait flag", async () => {
    const result = await runCommand(main, {
        rawArgs: ["--prompt", testPromptPath, "--check", testCheckPath, "--wait", "10"]
    })

    expect(result.result).toMatchObject({ wait: 10 })
})

test("reads wait from -w alias", async () => {
    const result = await runCommand(main, {
        rawArgs: ["--prompt", testPromptPath, "--check", testCheckPath, "-w", "10"]
    })

    expect(result.result).toMatchObject({ wait: 10 })
})

test("reads agent from --agent flag", async () => {
    const result = await runCommand(main, {
        rawArgs: ["--prompt", testPromptPath, "--check", testCheckPath, "--agent", "review"]
    })

    expect(result.result).toMatchObject({ agent: "review" })
})

test("reads agent from -a alias", async () => {
    const result = await runCommand(main, {
        rawArgs: ["--prompt", testPromptPath, "--check", testCheckPath, "-a", "review"]
    })

    expect(result.result).toMatchObject({ agent: "review" })
})

test("reads model from --model flag", async () => {
    const result = await runCommand(main, {
        rawArgs: ["--prompt", testPromptPath, "--check", testCheckPath, "--model", "custom/model"]
    })

    expect(result.result).toMatchObject({ model: "custom/model" })
})

test("reads model from -m alias", async () => {
    const result = await runCommand(main, {
        rawArgs: ["--prompt", testPromptPath, "--check", testCheckPath, "-m", "custom/model"]
    })

    expect(result.result).toMatchObject({ model: "custom/model" })
})

test("uses default limit", async () => {
    const result = await runCommand(main, {
        rawArgs: ["--prompt", testPromptPath, "--check", testCheckPath]
    })

    expect(result.result).toMatchObject({ limit: 0 })
})

test("uses default wait", async () => {
    const result = await runCommand(main, {
        rawArgs: ["--prompt", testPromptPath, "--check", testCheckPath]
    })

    expect(result.result).toMatchObject({ wait: 3 })
})

test("uses default agent", async () => {
    const result = await runCommand(main, {
        rawArgs: ["--prompt", testPromptPath, "--check", testCheckPath]
    })

    expect(result.result).toMatchObject({ agent: "build" })
})

test("uses default model", async () => {
    const result = await runCommand(main, {
        rawArgs: ["--prompt", testPromptPath, "--check", testCheckPath]
    })

    expect(result.result).toMatchObject({ model: "opencode/grok-code-fast-1" })
})

test("builds config from required args", async () => {
    const result = await runCommand(main, {
        rawArgs: ["--prompt", testPromptPath, "--check", testCheckPath]
    })

    expect(result.result).toMatchObject({
        prompt: testPromptPath,
        check: testCheckPath,
        limit: 0,
        wait: 3,
        agent: "build",
        model: "opencode/grok-code-fast-1"
    })
})

test("ignores extra CLI args", async () => {
    const result = await runCommand(main, {
        rawArgs: ["--prompt", testPromptPath, "--check", testCheckPath, "--foo", "--bar", "baz"]
    })

    expect(result.result).toMatchObject({
        prompt: testPromptPath,
        check: testCheckPath,
        limit: 0,
        wait: 3,
        agent: "build",
        model: "opencode/grok-code-fast-1"
    })
    expect(result.result).not.toHaveProperty("foo")
    expect(result.result).not.toHaveProperty("bar")
})

test("fails when prompt file is missing", async () => {
    const missingPromptPath = "test/fixtures/file-does-not-exist.md"

    await expect(
        runCommand(main, {
            rawArgs: ["--prompt", missingPromptPath, "--check", testCheckPath]
        })
    ).rejects.toThrow("--prompt file does not exist")
})
test.skip("fails when check file is missing", () => {})
test.skip("throws CLIError when --prompt flag is missing", () => {})
test.skip("throws CLIError when --check flag is missing", () => {})
