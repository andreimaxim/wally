import { test, expect } from "bun:test"
import { parseConfig } from "@/config"

const testPromptPath = "test/fixtures/PROMPT.md"
const testCheckPath = "test/fixtures/check.sh"

test("prompt is extracted from args", async () => {
    const config = await parseConfig({ prompt: testPromptPath, check: testCheckPath })

    expect(config.prompt).toBe(testPromptPath)
})

test("prompt points to a real file", async () => {
  const args = { prompt: "test/fixtures/file-does-not-exist.md", check: testCheckPath }

  expect(parseConfig(args)).rejects.toThrow("file does not exist")
})

test("missing prompt raises an error", async () => {
  expect(parseConfig({ check: testCheckPath })).rejects.toThrow("is required")
})

test("stop condition is extracted from args", async () => {
  const config = await parseConfig({ prompt: testPromptPath, check: testCheckPath })

  expect(config.check).toBe(testCheckPath)
})

test("stop condition has to be runnable", async () => {
  const args = { prompt: testPromptPath, check: "test/fixtures/missing-script" }

  expect(parseConfig(args)).rejects.toThrow("file does not exist")
})

test("missing stop condition raises an error", async () => {
  expect(parseConfig({ prompt: testPromptPath })).rejects.toThrow("is required")
})

test("maximum number of invocations is extracted from the args", async () => {
  const config = await parseConfig({ prompt: testPromptPath, check: testCheckPath, limit: "5" })

  expect(config.limit).toBe(5)
})

test("maximum number of invocations has to be a number", async () => {
  const args = { prompt: testPromptPath, check: testCheckPath, limit: "many" }

  expect(parseConfig(args)).rejects.toThrow("invalid_type")
})

test("default number of maximum invocations is 0", async () => {
  const config = await parseConfig({ prompt: testPromptPath, check: testCheckPath })

  expect(config.limit).toBe(0)
})

test("wait time between invocations is extracted from the args", async () => {
  const config = await parseConfig({ prompt: testPromptPath, check: testCheckPath, wait: "10" })

  expect(config.wait).toBe(10)
})

test("default wait time between invocations has to be a number", async () => {
  const args = { prompt: testPromptPath, check: testCheckPath, wait: "an hour" }

  expect(parseConfig(args)).rejects.toThrow("invalid_type")
})

test("default wait time between invocations is 3", async () => {
  const config = await parseConfig({ prompt: testPromptPath, check: testCheckPath })

  expect(config.wait).toBe(3)
})

test("agent is extracted from args", async () => {
  const config = await parseConfig({
    prompt: testPromptPath,
    check: testCheckPath,
    agent: "review"
  })

  expect(config.agent).toBe("review")
})
test("default agent is 'build'", async () => {
  const config = await parseConfig({ prompt: testPromptPath, check: testCheckPath })

  expect(config.agent).toBe("build")
})

test("model is extracted from args", async () => {
  const config = await parseConfig({
    prompt: testPromptPath,
    check: testCheckPath,
    model: "custom/model"
  })

  expect(config.model).toBe("custom/model")
})
test("default model is 'opencode/grok-code-fast-1'", async () => {
  const config = await parseConfig({ prompt: testPromptPath, check: testCheckPath })

  expect(config.model).toBe("opencode/grok-code-fast-1")
})
