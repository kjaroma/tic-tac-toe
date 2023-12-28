import { appConfigSchemas } from './config/config.schema';
import { FastifyInstance } from "fastify";
import { userSchemas } from "../../modules/user/user.schema";
import { healthcheckSchemas } from "../../modules/healthcheck/healthcheck.schema";
import { buildJsonSchemas } from "fastify-zod";

export const { schemas, $ref } = buildJsonSchemas({
    ...healthcheckSchemas,
    ...userSchemas,
    ...appConfigSchemas,
})

export function loadSchemas(app: FastifyInstance) {
    for (let schema of schemas) {
        app.addSchema(schema);
    }
}