import { z, ZodError } from "zod"

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
    limit: z.coerce.number(),
    wait: z.coerce.number(),
    agent: z.string(),
    model: z.string()
})

export type ConfigArgs = z.input<typeof ConfigSchema>
export type Config = z.infer<typeof ConfigSchema>

export class ConfigError extends Error {
    path?: string
    code: string
    reason: string

    constructor(reason: string, code: string, path?: string) {
        const message = reason.includes(code) ? reason : `${reason} (${code})`
        super(message)
        this.name = "ConfigError"
        this.reason = reason
        this.code = code
        this.path = path
    }
}

const toConfigError = (error: ZodError) => {
    const issue = error.issues[0]
    if (!issue) {
        return error
    }

    const path = typeof issue.path[0] === "string" ? issue.path[0] : undefined
    const reason = issue.message || issue.code

    return new ConfigError(reason, issue.code, path)
}

export async function parseConfig(args: ConfigArgs): Promise<Config> {
    return ConfigSchema.parseAsync(args).catch((error: unknown) => {
        if (error instanceof ZodError) {
            throw toConfigError(error)
        }

        throw error
    })
}
