import fastifyWebsocket, { SocketStream } from '@fastify/websocket';
import { FastifyInstance } from 'fastify';
import { createGame, playGame } from './game.controller';
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
    '/test',
    {
      websocket: true,
    },
    async function (connection: SocketStream) {
      const { socket } = connection;
      socket.on('message', (message) => {
        app.log.info(message.toString());
        const payload = JSON.parse(message.toString());
        switch (payload.type) {
          case 'move':
            console.log('move');
            break;
          default:
            break;
        }
      });
    },
  );

  app.get(
    '/:gameId',
    {
      websocket: true,
    },
    playGame,
  );
}
