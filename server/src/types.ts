import { JWT } from '@fastify/jwt'
import { AppConfigType } from './utils/server/config/config.schema'

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT,
  }
  interface FastifyInstance {
    config: AppConfigType
  }
}
