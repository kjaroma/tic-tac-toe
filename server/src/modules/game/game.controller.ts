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

  const { sub: userId } = authService.decodeAuthToken(token);
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
  gameService.addGamePlayer(gameId, userId);

  // if (
  //   server.clients.size === 1 &&
  //   game.hostId !== null &&
  //   game.hostId !== userId
  // ) {
  //   await gameService.setGameHost(gameId, userId);
  // } else {
  //   await gameService.setGameGuest(gameId, userId);
  // }

  if (server.clients.size === 2) {
    messageService.emitInfoMessage('Second player joined, starting game');
    await gameService.setGameState(gameId, GameStatus.STARTED);
  }
  connection.socket.on('message', (rawMessage) => {
    const message = JSON.parse(rawMessage.toString());
    switch (message.type as GameMessageType) {
      case GameMessageType.MOVE:
        try {
          const state = gameService.setBoardMove(
            gameId,
            message.payload.col,
            message.payload.row,
            userId,
          );
          const { validation, board, history } = state;
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
          messageService.emitStateMessage(state);
        } catch (e) {
          if (e instanceof GameError) {
            messageService.emitErrorMessage(e.message);
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
