import { z } from "zod"

const DEFAULTS = {
    limit: 0,
    wait: 3,
    agent: "build",
    model: "opencode/grok-code-fast-1"
}

/*
  In general, the validation error messages should not contain the subject
  since it can be inferred from the object that is causing them (e.g.
  "prompt" and "is required").

  The final formatting (e.g `--prompt is missing`) should be perfomed by the
  caller, since this module should not know it's used to validate CLI args.
*/
const Config = z.object({
    prompt: z.string("is required").refine((path) => Bun.file(path).exists(), {
        message: "file does not exist"
    }),
    check: z.string("is required").refine((path) => Bun.file(path).exists(), {
        message: "file does not exist"
    }),
    limit: z.coerce.number().default(DEFAULTS.limit),
    wait: z.coerce.number().default(DEFAULTS.wait),
    agent: z.string().default(DEFAULTS.agent),
    model: z.string().default(DEFAULTS.model)
})

export type Config = z.infer<typeof Config>

export async function parseConfig(args: z.input<typeof Config>): Promise<Config> {
  return Config.parseAsync(args)
}
