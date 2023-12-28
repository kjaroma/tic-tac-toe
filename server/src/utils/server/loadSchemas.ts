import { appConfigSchemas } from './loadConfig';
import { FastifyInstance } from "fastify";
import { userSchemas } from "../../modules/user/user.schema";
import { healthcheckSchemas } from "../../modules/healthcheck/healthcheck.schema";
import { buildJsonSchemas } from "fastify-zod";

export function loadSchemas(app: FastifyInstance) {
    const { schemas: appSchemas, $ref } = buildJsonSchemas({
        ...userSchemas,
        ...healthcheckSchemas,
        ...appConfigSchemas,
    }, {$id: "ApplicationSchemas"})
    console.log(JSON.stringify(appSchemas, null, 2))
    for (let schema of [appSchemas]) {
        app.addSchema(schema);
    }
}