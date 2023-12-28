import { FastifyInstance } from 'fastify';
import z from "zod";
import { fastifyEnv } from '@fastify/env'
import { buildJsonSchemas } from 'fastify-zod';
import { isDevEnv } from '../env';

const appConfigSchema = z.object({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    JWT_ISSUER: z.string(),
    JWT_TTL_SECS: z.number(),
})

export const appConfigSchemas = {
    appConfigSchema
}

export type AppConfigType = z.infer<typeof appConfigSchema>

// TODO Convert zod schema
// ADD database
const appConfigJsonSchema = {
    "type": "object",
    "properties": {
        "DATABASE_URL": {
            "type": "string"
        },
        "JWT_SECRET": {
            "type": "string"
        },
        "JWT_ISSUER": {
            "type": "string"
        },
        "JWT_TTL_SECS": {
            "type": "number"
        }
    },
    "required": [
        "JWT_SECRET",
        "JWT_ISSUER",
        "JWT_TTL_SECS"
    ],
    "additionalProperties": false
}

const options = {
    schema: appConfigJsonSchema,
    dotenv: {
        path: `${process.cwd()}/.env`,
        debug: isDevEnv()
    }
}

export async function loadConfig(app: FastifyInstance) {
    await app.register(fastifyEnv, options)
}