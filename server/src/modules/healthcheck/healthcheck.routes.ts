import { FastifyInstance } from "fastify";
import { healthcheck } from "./healthcheck.controller";
import { $ref } from "./healthcheck.schema";

export async function healthcheckRoutes(app: FastifyInstance) {
    app.get('/', {
        schema: {
            response: {
            200: $ref('healthcheckResponseSchema')
            }
        }
    },
    healthcheck)
}