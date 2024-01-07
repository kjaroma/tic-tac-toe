import { FastifyReply, FastifyRequest } from 'fastify';
import { HttpStatus } from '../../common/constants';
import { SocketStream } from '@fastify/websocket';
import {
  GameMessageType,
  GameStatus,
  GameValidationStatus,
} from '../../shared/types';
import { GameError } from '../../common/errors';

export async function createGame(req: FastifyRequest, reply: FastifyReply) {
  const { id } = await req.server.gameService.createGame();
  reply.status(HttpStatus.CREATED).send({ gameId: id });
}

export async function playGame(connection: SocketStream, req: FastifyRequest) {
  const broadCastMessage = (message: string) => {
    for (const client of server.clients) {
      client.send(message);
    }
  };

  const { token } = req.query as { token: string };
  const { authService, gameService } = req.server;
  const server = req.server.websocketServer;

  const { sub: userId } = authService.decodeAuthToken(token);
  const { gameId } = req.params as { gameId: string };

  const game = await gameService.findGameById(gameId);
  // TODO check if game was not completed before
  if (!game) {
    throw new Error('Game not found');
  }

  if (server.clients.size > 2) {
    connection.socket.send(`Game full, try create new game`);
    connection.socket.close();
  }

  if (
    server.clients.size === 1 &&
    game.hostId !== null &&
    game.hostId !== userId
  ) {
    await gameService.setGameHost(gameId, userId);
  } else {
    await gameService.setGameGuest(gameId, userId);
  }

  if (server.clients.size === 2) {
    broadCastMessage('Second player joined, starting game');
    await gameService.setGameState(gameId, GameStatus.STARTED);

    gameService.createGameBoard(3, gameId);

    connection.socket.on('message', (message) => {
      const payload = JSON.parse(message.toString());
      switch (payload.type as GameMessageType) {
        case GameMessageType.MOVE:
          try {
            const gameState = gameService.setBoardMove(
              gameId,
              payload.col,
              payload.row,
              userId,
            );
            const { validation, board, history } = gameState;
            if (
              validation.status === GameValidationStatus.TIE ||
              validation.status === GameValidationStatus.WIN
            ) {
              gameService.saveGame(gameId, {
                state: GameStatus.FINISHED,
                // TODO Handle tie
                winnerId: validation.winnerId,
                gameData: { board, history },
              });
            }
            broadCastMessage(
              JSON.stringify({
                type: GameMessageType.STATE_UPDATE,
                payload: { ...gameState },
              }),
            );
          } catch (e) {
            if (e instanceof GameError) {
              broadCastMessage(
                JSON.stringify({
                  type: GameMessageType.ERROR,
                  payload: {
                    message: e.message,
                  },
                }),
              );
            }
          }
          break;
        default:
          break;
      }
    });
  }

  return null;
}
