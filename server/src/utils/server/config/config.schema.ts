import z from "zod"

const appConfigSchema = z.object({
    DATABASE_URL: z.string(),
    COOKIE_SIGN_SECRET: z.string(),
    JWT_SECRET: z.string(),
    JWT_ISSUER: z.string(),
    JWT_TTL_SECS: z.number()
})

export type AppConfigType = z.infer<typeof appConfigSchema>

export const appConfigSchemas = {
    appConfigSchema
}