export type Config = {
    prompt: string
}

export function parseConfig(args: string[]): Config {
    return { prompt: "" }
}