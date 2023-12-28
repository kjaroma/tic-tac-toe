import { JWT } from '@fastify/jwt'
import { AppConfigType } from './utils/server/loadConfig'

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT,
    config: AppConfigType
  }
}
