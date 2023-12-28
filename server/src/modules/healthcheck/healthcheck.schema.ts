import { buildJsonSchemas } from "fastify-zod";
import z from "zod";

const healthcheckResponseSchema = z.object({
    status: z.literal("OK")
}) 

export const healthcheckSchemas =  {
    healthcheckResponseSchema
}