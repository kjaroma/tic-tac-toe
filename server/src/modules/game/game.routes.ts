import fastifyWebsocket, { SocketStream } from '@fastify/websocket';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { createGame } from './game.controller';
import { $ref } from '../../bootstrap/schemas/schemas.handler';
import { GameState } from '../../shared/types';

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
    async function (conn: SocketStream, req: FastifyRequest) {
      const { token } = req.query as { token: string };
      const { sub: userId, name } = app.authService.decodeAuthToken(token);

      const { gameId } = req.params as { gameId: string };

      // TODO Find better way to do not update the game
      let game;
      game = await app.gameService.findGameById(gameId);
      if (!game) {
        throw new Error('Game not found');
      }

      const broadCastMessage = (message: string) => {
        for (const client of server.clients) {
          client.send(message);
        }
      };

      const server = app.websocketServer;
      if (server.clients.size > 2) {
        conn.socket.send(`Game full, try create new game`);
        conn.socket.close();
      }

      if (
        server.clients.size === 1 &&
        game.hostId !== null &&
        game.hostId !== userId
      ) {
        game = await app.gameService.setGameHost(game, userId);
      } else {
        game = await app.gameService.setGameGuest(game, userId);
      }

      if (server.clients.size === 2) {
        broadCastMessage('Second player joined, starting game');
        game = await app.gameService.setGameState(game, GameState.STARTED);
        conn.socket.on('message', (message) => {
          const payload = JSON.parse(message.toString());
          switch (payload.type) {
            case 'move':
              app.gameService.setMove(payload.col, payload.row);
              break;
            default:
              break;
          }
          app.gameService.printBoard();
          broadCastMessage(`Current board: ${JSON.stringify('?', null, 2)}\n`);
        });
      }
    },
  );
}
