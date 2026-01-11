import { defineCommand } from "citty"
import { ConfigError, parseConfig } from "@/config"

const formatConfigError = (error: ConfigError) => {
    if (!error.path) {
        return error
    }

    return new Error(`--${error.path} ${error.reason}`)
}

export const main = defineCommand({
    meta: {
        name: "wally",
        description: "Simple orchestration for agent invocation with context replay"
    },
    args: {
        prompt: {
            type: "string",
            alias: "p",
            required: true
        },
        check: {
            type: "string",
            alias: "c",
            required: true
        },
        limit: {
            type: "string",
            alias: "l",
            default: "0"
        },
        wait: {
            type: "string",
            alias: "w",
            default: "3"
        },
        agent: {
            type: "string",
            alias: "a",
            default: "build"
        },
        model: {
            type: "string",
            alias: "m",
            default: "opencode/grok-code-fast-1"
        }
    },
    async run(context) {
        return parseConfig(context.args).catch((error) => {
            if (error instanceof ConfigError) {
                throw formatConfigError(error)
            }

            throw error
        })
    }
})
