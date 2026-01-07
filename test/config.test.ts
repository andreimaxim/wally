import { test, expect } from "bun:test"

import { parseConfig } from "@/config"

test("prompt is extracted from args", async () => {
  const config = await parseConfig({ prompt: "test/fixtures/PROMPT.md", check: "test/fixtures/ci" })

  expect(config.prompt).toBe("test/fixtures/PROMPT.md")
})

test("prompt points to a real file", async () => {
  const args = { prompt: "test/fixtures/file-does-not-exist.md", check: "test/fixtures/ci" }

  expect(parseConfig(args)).rejects.toThrow("file does not exist")
})

test("missing prompt raises an error", async () => {
  expect(parseConfig({ check: "test/fixtures/ci" })).rejects.toThrow("is required")
})

test("stop condition is extracted from args", async () => {
  const config = await parseConfig({ prompt: "test/fixtures/PROMPT.md", check: "test/fixtures/ci" })

  expect(config.check).toBe("test/fixtures/ci")
})

test("stop condition has to be runnable", async () => {
  const args = { prompt: "test/fixtures/PROMPT.md", check: "test/fixtures/missing-script" }

  expect(parseConfig(args)).rejects.toThrow("file does not exist")
})

test("missing stop condition raises an error", async () => {
  expect(parseConfig({ prompt: "test/fixtures/PROMPT.md" })).rejects.toThrow("is required")
})

test("maximum number of invocations is extracted from the args", async () => {
  const config = await parseConfig({
    prompt: "test/fixtures/PROMPT.md",
    check: "test/fixtures/ci",
    limit: "5"
  })

  expect(config.limit).toBe(5)
})

test("maximum number of invocations has to be a number", async () => {
  const args = { prompt: "test/fixtures/PROMPT.md", check: "test/fixtures/ci", limit: "many" }

  expect(parseConfig(args)).rejects.toThrow("invalid_type")
})

test("default number of maximum invocations is 0", async () => {
  const config = await parseConfig({ prompt: "test/fixtures/PROMPT.md", check: "test/fixtures/ci" })

  expect(config.limit).toBe(0)
})

test("wait time between invocations is extracted from the args", async () => {
  const config = await parseConfig({
    prompt: "test/fixtures/PROMPT.md",
    check: "test/fixtures/ci",
    wait: "10"
  })

  expect(config.wait).toBe(10)
})

test("default wait time between invocations has to be a number", async () => {
  const args = { prompt: "test/fixtures/PROMPT.md", check: "test/fixtures/ci", wait: "an hour" }

  expect(parseConfig(args)).rejects.toThrow("invalid_type")
})

test("default wait time between invocations is 3", async () => {
  const config = await parseConfig({ prompt: "test/fixtures/PROMPT.md", check: "test/fixtures/ci" })

  expect(config.wait).toBe(3)
})
