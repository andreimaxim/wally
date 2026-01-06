import { test, expect } from "bun:test"

import { parseConfig, type Config } from "@/config"

test("works", () => {
    const config = parseConfig([])
    expect(config.prompt).toBe("PROMPT.md")
})