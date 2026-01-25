import { defineCommand } from "citty"
import { parseConfig } from "@/config"

type ConfigIssue = {
    path?: string
    code: string
    reason: string
}

type ConfigErrorLike = Error & {
    name: "ConfigError"
    path?: string
    reason?: string
    issues?: ConfigIssue[]
}

const isConfigError = (error: unknown): error is ConfigErrorLike => {
    if (!(error instanceof Error)) {
        return false
    }

    if (error.name !== "ConfigError") {
        return false
    }

    const err = error as Partial<ConfigErrorLike>

    return typeof err.reason === "string" || Array.isArray(err.issues)
}

const formatConfigError = (error: ConfigErrorLike): Error => {
    const issue = error.issues?.[0]
    const path = issue?.path ?? error.path
    const reason = issue?.reason ?? error.reason ?? error.message

    if (!path) {
        return new Error(reason)
    }

    return new Error(`--${path} ${reason}`)
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
            alias: "l"
        },
        wait: {
            type: "string",
            alias: "w"
        },
        agent: {
            type: "string",
            alias: "a"
        },
        model: {
            type: "string",
            alias: "m"
        }
    },
    async run(context) {
        return parseConfig(context.args).catch((error) => {
            if (isConfigError(error)) {
                throw formatConfigError(error)
            }

            throw error
        })
    }
})
