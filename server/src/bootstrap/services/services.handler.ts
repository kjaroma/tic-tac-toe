import { UserRepository } from '../../repositories/UserRepository';
import { AuthService } from '../../services/auth/auth.service';
import prisma from '../../utils/prisma';
import { authHandler } from '../auth/auth.handler';
import { UserService } from '../../services/user/user.service';
import { FastifyInstance } from 'fastify';
import GameService from '../../services/game/game.service';
import { GameRepository } from '../../repositories/GameRepository';
import LobbyService from '../../services/lobby/lobby.service';

export function registerServices(app: FastifyInstance) {
  app.decorate('authenticate', authHandler);

  const userRepository = new UserRepository(prisma);
  const userService = new UserService(userRepository);
  app.decorate('userService', userService);

  const authService = new AuthService(userService, app.config, app.jwt);
  app.decorate('authService', authService);

  const gameRepository = new GameRepository(prisma);
  const gameService = new GameService(gameRepository);
  app.decorate('gameService', gameService);

  const lobbyService = new LobbyService(2);
  app.decorate('lobbyService', lobbyService);
}
