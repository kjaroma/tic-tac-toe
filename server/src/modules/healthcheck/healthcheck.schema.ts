import z from "zod";

export const healthcheckResponseSchema = z.object({
    status: z.literal("OK")
}) 

export const healthcheckSchemas = { healthcheckResponseSchema }