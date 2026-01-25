import { z, ZodError } from "zod"

type ConfigIssue = {
    path?: string
    code: string
    reason: string
}

/*
  In general, the validation error messages should not contain the subject
  since it can be inferred from the object that is causing them (e.g.
  "prompt" and "is required").

  The final formatting (e.g `--prompt is missing`) should be perfomed by the
  caller, since this module should not know it's used to validate CLI args.
 */
const ConfigSchema = z.object({
    prompt: z.string("is required").refine((path) => Bun.file(path).exists(), {
        message: "file does not exist"
    }),
    check: z.string("is required").refine((path) => Bun.file(path).exists(), {
        message: "file does not exist"
    }),
    limit: z.coerce.number().default(0),
    wait: z.coerce.number().default(3),
    agent: z.string().default("build"),
    model: z.string().default("opencode/grok-code-fast-1")
})

export type Config = z.infer<typeof ConfigSchema>

class ConfigError extends Error {
    path?: string
    code: string
    reason: string
    issues: ConfigIssue[]

    constructor(reason: string, code: string, path: string | undefined, issues: ConfigIssue[]) {
        const message = reason.includes(code) ? reason : `${reason} (${code})`
        super(message)
        this.name = "ConfigError"
        this.reason = reason
        this.code = code
        this.path = path
        this.issues = issues
    }
}

const toIssues = (error: ZodError): ConfigIssue[] =>
    error.issues.map((issue) => {
        const path = typeof issue.path[0] === "string" ? issue.path[0] : undefined
        const reason = issue.message || issue.code

        return {
            path,
            code: issue.code,
            reason
        }
    })

const toConfigError = (error: ZodError): ConfigError => {
    const issues = toIssues(error)
    const issue = issues[0]
    if (!issue) {
        return new ConfigError("validation error", "unknown", undefined, [])
    }

    return new ConfigError(issue.reason, issue.code, issue.path, issues)
}

export async function parseConfig(args: unknown): Promise<Config> {
    return ConfigSchema.parseAsync(args).catch((error: unknown) => {
        if (error instanceof ZodError) {
            throw toConfigError(error)
        }

        throw error
    })
}
