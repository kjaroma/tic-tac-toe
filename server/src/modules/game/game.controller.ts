import { FastifyReply, FastifyRequest } from 'fastify';
import { HttpStatus } from '../../common/constants';
import { SocketStream } from '@fastify/websocket';
import {
  GameMessageType,
  GameStatus,
  GameValidationStatus,
} from '../../shared/types';
import { GameError } from '../../common/errors';
import MessageService from '../../services/message/message.service';

export async function createGame(req: FastifyRequest, reply: FastifyReply) {
  const { id } = await req.server.gameService.createGame();
  reply.status(HttpStatus.CREATED).send({ gameId: id });
}

export async function playGame(connection: SocketStream, req: FastifyRequest) {
  const { token } = req.query as { token: string };
  const { authService, gameService } = req.server;
  const server = req.server.websocketServer;
  const messageService = new MessageService(server);

  const { sub: playerId, name } = authService.decodeAuthToken(token);
  const { gameId } = req.params as { gameId: string };

  const game = await gameService.findGameById(gameId);
  // TODO check if game was not completed before
  if (!game) {
    throw new Error('Game not found');
  }

  if (server.clients.size > 2) {
    connection.socket.send(
      messageService.getInfoMessage(`Game full, try create new game`),
    );
    connection.socket.close();
  }

  gameService.createGameBoard(3, gameId);
  const state = gameService.addGamePlayer(gameId, playerId, name ?? '-');
  if (state && server.clients.size === 2) {
    // TODO Sometimes player misses state update
    messageService.emitStateMessage(state);
  }

  if (server.clients.size === 2) {
    messageService.emitInfoMessage('Second player joined, starting game');
    await gameService.setGameState(gameId, GameStatus.STARTED);
  }

  connection.socket.on('close', () => {
    // TODO remove player from game.
  })

  connection.socket.on('message', (rawMessage) => {
    const message = JSON.parse(rawMessage.toString());
    switch (message.type as GameMessageType) {
      case GameMessageType.MOVE:
        try {
          const state = gameService.setBoardMove(
            gameId,
            message.payload.col,
            message.payload.row,
            playerId,
          );
          const { validation, board, history, players } = state;
          if (
            validation.status === GameValidationStatus.TIE ||
            validation.status === GameValidationStatus.WIN
          ) {
            gameService.saveGame(gameId, {
              state: GameStatus.FINISHED,
              // TODO Handle tie
              // TODO Refactor this
              hostId: players.find((pl) => pl.type === 'host')?.id ?? null,
              guestId: players.find((pl) => pl.type === 'guest')?.id ?? null,
              winnerId: validation.winnerId,
              gameData: { board, history },
            });
          }
          messageService.emitStateMessage(state);
        } catch (e) {
          if (e instanceof GameError) {
            if (e.message === 'It is not your turn now')
              connection.socket.send(messageService.getInfoMessage(e.message));
            else {
              messageService.emitErrorMessage(e.message);
            }
          } else {
            throw e;
          }
        }
        break;
      default:
        break;
    }
  });
}
