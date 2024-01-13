import fastifyWebsocket from '@fastify/websocket';
import { FastifyInstance } from 'fastify';
import { createGame, gameLobby, playGame } from './game.controller';
import { $ref } from '../../bootstrap/schemas/schemas.handler';

export async function gameRoutes(app: FastifyInstance) {
  await app.register(fastifyWebsocket, {
    options: {
      clientTracking: true,
      // TODO Add client verification
      // verifyClient option
    },
  });

  app.get(
    '/lobby',
    {
      websocket: true,
    },
    gameLobby,
  );

  app.get(
    '/create',
    {
      schema: {
        response: {
          201: $ref('createGameResponseSchema'),
        },
      },
      preHandler: [app.authenticate],
    },
    createGame,
  );

  app.get(
    '/:gameId',
    {
      websocket: true,
    },
    playGame,
  );
}
