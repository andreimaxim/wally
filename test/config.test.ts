import { test, expect } from "bun:test"
import { parseConfig } from "@/config"

const testPromptPath = "test/fixtures/PROMPT.md"
const testCheckPath = "test/fixtures/check.sh"
const baseArgs = {
  prompt: testPromptPath,
  check: testCheckPath,
  limit: "0",
  wait: "3",
  agent: "build",
  model: "opencode/grok-code-fast-1"
}
const parseConfigUnsafe = (args: Partial<typeof baseArgs>) =>
  parseConfig(args as unknown as Parameters<typeof parseConfig>[0])

test("prompt is extracted from args", async () => {
  const config = await parseConfig(baseArgs)

  expect(config.prompt).toBe(testPromptPath)
})

test("prompt points to a real file", async () => {
  const args = { ...baseArgs, prompt: "test/fixtures/file-does-not-exist.md" }

  expect(parseConfig(args)).rejects.toThrow("file does not exist")
})

test("missing prompt raises an error", async () => {
  const { prompt: _, ...args } = baseArgs

  expect(parseConfigUnsafe(args)).rejects.toThrow("is required")
})

test("stop condition is extracted from args", async () => {
  const config = await parseConfig(baseArgs)

  expect(config.check).toBe(testCheckPath)
})

test("stop condition has to be runnable", async () => {
  const args = { ...baseArgs, check: "test/fixtures/missing-script" }

  expect(parseConfig(args)).rejects.toThrow("file does not exist")
})

test("missing stop condition raises an error", async () => {
  const { check: _, ...args } = baseArgs

  expect(parseConfigUnsafe(args)).rejects.toThrow("is required")
})

test("maximum number of invocations is extracted from the args", async () => {
  const config = await parseConfig({ ...baseArgs, limit: "5" })

  expect(config.limit).toBe(5)
})

test("maximum number of invocations has to be a number", async () => {
  const args = { ...baseArgs, limit: "many" }

  expect(parseConfig(args)).rejects.toThrow("invalid_type")
})

test("missing limit raises an error", async () => {
  const { limit: _, ...args } = baseArgs

  expect(parseConfigUnsafe(args)).rejects.toThrow()
})

test("wait time between invocations is extracted from the args", async () => {
  const config = await parseConfig({ ...baseArgs, wait: "10" })

  expect(config.wait).toBe(10)
})

test("default wait time between invocations has to be a number", async () => {
  const args = { ...baseArgs, wait: "an hour" }

  expect(parseConfig(args)).rejects.toThrow("invalid_type")
})

test("missing wait raises an error", async () => {
  const { wait: _, ...args } = baseArgs

  expect(parseConfigUnsafe(args)).rejects.toThrow()
})

test("agent is extracted from args", async () => {
  const config = await parseConfig({ ...baseArgs, agent: "review" })

  expect(config.agent).toBe("review")
})
test("missing agent raises an error", async () => {
  const { agent: _, ...args } = baseArgs

  expect(parseConfigUnsafe(args)).rejects.toThrow()
})

test("model is extracted from args", async () => {
  const config = await parseConfig({ ...baseArgs, model: "custom/model" })

  expect(config.model).toBe("custom/model")
})

test("missing model raises an error", async () => {
  const { model: _, ...args } = baseArgs

  expect(parseConfigUnsafe(args)).rejects.toThrow()
})
