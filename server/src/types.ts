import { JWT } from '@fastify/jwt'
import { UserService } from './services/user/user.service'
import { AuthService } from './services/auth/auth.service'
import { AppConfigType } from './bootstrap/config/config.schema'
import GameService from './services/game/game.service'

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT,
  }
  interface FastifyInstance {
    config: AppConfigType,
    userService: UserService,
    authService: AuthService,
    gameService: GameService,
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