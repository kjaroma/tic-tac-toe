import { JWT } from '@fastify/jwt';
import { UserService } from './services/user/user.service';
import { AuthService } from './services/auth/auth.service';
import { AppConfigType } from './bootstrap/config/config.schema';
import GameService from './services/game/game.service';
import MessageService from './services/message/message.service';

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT;
  }
  interface FastifyInstance {
    config: AppConfigType;
    userService: UserService;
    authService: AuthService;
    gameService: GameService;
    messageService: MessageService;
    authenticate: (req: FastifyRequest) => void;
  }
}

export type AuthTokenPayload = {
  sub: string;
  iss: string;
  email: string;
  name?: string;
};
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: AuthTokenPayload;
  }
}
