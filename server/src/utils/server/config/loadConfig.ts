import { FastifyInstance } from 'fastify';
import { fastifyEnv } from '@fastify/env'
import { isDevEnv } from '../../env';
import { $ref } from '../loadSchemas';

// TODO Convert zod schema
const appConfigJsonSchema = {
    "type": "object",
    "properties": {
        "DATABASE_URL": {
            "type": "string"
        },
        "JWT_SECRET": {
            "type": "string"
        },
    },
    "required": [
        "JWT_SECRET",
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