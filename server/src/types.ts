import { JWT } from '@fastify/jwt'
import { AppConfigType } from './utils/server/config/config.schema'
import { UserService } from './services/user/userService'
import { AuthService } from './services/auth/authService'

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT,
  }
  interface FastifyInstance {
    config: AppConfigType,
    userService: UserService,
    authService: AuthService,
    // TODO add more specific type
    authenticate: any,
  }
}

export type UserPayload = {
  sub: string,
  iss: string,
  email: string,
  name?: string,
}
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: UserPayload
  }
}