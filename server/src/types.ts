import { JWT } from '@fastify/jwt'
import { AppConfigType } from './utils/server/config/config.schema'

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT,
  }
  interface FastifyInstance {
    config: AppConfigType,
    // TODO add more specific type
    authenticate: any,
  }
}

type UserPayload = {
  id: string
  email: string
  name: string
}
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: UserPayload
  }
}