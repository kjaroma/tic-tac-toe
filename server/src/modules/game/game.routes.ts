import fastifyWebsocket from '@fastify/websocket';
import { FastifyInstance } from 'fastify';
import { playGame } from './game.controller';
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
    '/play',
    {
      websocket: true,
      schema: {
        querystring: $ref('gamePlayQuerySchema')
      }
    },
    playGame,
  )
}