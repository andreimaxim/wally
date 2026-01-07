import { z } from "zod"

const Config = z.object({
  prompt: z.string("is required").refine((path) => Bun.file(path).exists(), {
    message: "file does not exist"
  }),
  check: z.string("is required").refine((path) => Bun.file(path).exists(), {
    message: "file does not exist"
  }),
  limit: z.coerce.number().default(0),
  wait: z.coerce.number().default(3)
})

export type Config = z.infer<typeof Config>

export async function parseConfig(args: {}): Promise<Config> {
  return Config.parseAsync(args)
}
