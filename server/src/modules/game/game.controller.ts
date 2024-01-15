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
import { WSRoom } from '../../types';
import { GameMessage } from '../../shared/messages';

export async function createGame(req: FastifyRequest, reply: FastifyReply) {
  const { id } = await req.server.gameService.createGame();
  reply.status(HttpStatus.CREATED).send({ gameId: id });
}

export async function gameLobby(connection: SocketStream, req: FastifyRequest) {
  const { token } = req.query as { token: string };
  const { authService, gameService, lobbyService } = req.server;

  const { sub: playerId, name } = authService.decodeAuthToken(token);

  const socket = Object.assign(connection.socket, { roomId: undefined });
  socket.send(
    JSON.stringify({
      type: GameMessageType.LOBBY_UPDATE,
      payload: { rooms: lobbyService.getLobbyInfo() },
    }),
  );

  const lobbyUpdateInterval = setInterval(() => {
    socket.send(
      JSON.stringify({
        type: GameMessageType.LOBBY_UPDATE,
        payload: { rooms: lobbyService.getLobbyInfo() },
      }),
    );
  }, 5000);

  socket.on('message', (raw) => {
    const { log } = req;
    let message: GameMessage;
    try {
      message = JSON.parse(raw.toString());
    } catch (e) {
      log.error(
        'Failed to parse WS raw message' + JSON.stringify(raw.toString()),
      );
      return;
    }
    const { type, payload } = message;
    req.server.log.info(type, payload)

    switch (type as GameMessageType) {

      case GameMessageType.CREATE_ROOM:
        // eslint-disable-next-line no-case-declarations
        const roomId = lobbyService.createRoom(socket as unknown as WSRoom);
        gameService.createGameBoard(3, roomId)
        gameService.addGamePlayer(roomId, playerId, name ?? "-")
        socket.send(
          JSON.stringify({
            type: GameMessageType.ROOM_CREATED,
            payload: { roomId },
          }),
        );
        break;

      case GameMessageType.JOIN_ROOM: {
        // eslint-disable-next-line no-case-declarations
        const roomId = lobbyService.joinRoom(payload.roomId, socket as unknown as WSRoom);
        if (roomId) {
          socket.send(
            JSON.stringify({
              type: GameMessageType.ROOM_JOINED,
              payload: { roomId },
            }),
          );
          const gameState = gameService.addGamePlayer(roomId, playerId, name ?? "-")
          if (gameState) {
            const sockets = lobbyService.getRoomSockets(
              lobbyService.getRoomIdFromSocket(socket as unknown as WSRoom),
            );
            for (const socket of sockets) {
              socket.send(JSON.stringify(
                {
                  type: GameMessageType.STATE_UPDATE,
                  payload: { gameState }
                }
              ));
            }
          }
        }
      }
        break;

      case GameMessageType.LEAVE: {
        const roomId = lobbyService.getRoomIdFromSocket(socket as unknown as WSRoom)
        const isClosed = lobbyService.leaveRoom(socket as unknown as WSRoom);
        if (isClosed) {
          // TODO clean up game
          req.server.log.info(`Game ${roomId} should be closed`)
        }
      }
        break;

      case GameMessageType.MAKE_MOVE: {
        const roomId = lobbyService.getRoomIdFromSocket(socket as unknown as WSRoom)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { col, row } = payload as any // TODO proper type
        let gameState;
        try {
          gameState = gameService.setBoardMove(
            roomId,
            col,
            row,
            playerId,
          );
          const { validation, board, history, players } = gameState;
          if (
            validation.status === GameValidationStatus.TIE ||
            validation.status === GameValidationStatus.WIN
          ) {
            gameService.saveNewGame(roomId, {
              state: GameStatus.FINISHED,
              // TODO Handle tie
              // TODO Refactor this
              hostId: players.find((pl) => pl.type === 'host')?.id ?? null,
              guestId: players.find((pl) => pl.type === 'guest')?.id ?? null,
              winnerId: validation.winnerId,
              gameData: { board, history },
            });
          }
        } catch (e) {
          if (e instanceof GameError) {
            if (e.message === 'It is not your turn now') {
              const sockets = lobbyService.getRoomSockets(
                lobbyService.getRoomIdFromSocket(socket as unknown as WSRoom),
              );
              for (const socket of sockets) {
                socket.send(JSON.stringify(
                  {
                    type: GameMessageType.STATE_UPDATE,
                    payload: { gameState }
                  }
                ));
              }
            } else {
              throw e;
            }
          }
        }
        if (gameState) {
          const sockets = lobbyService.getRoomSockets(
            lobbyService.getRoomIdFromSocket(socket as unknown as WSRoom),
          );
          for (const socket of sockets) {
            socket.send(JSON.stringify(
              {
                type: GameMessageType.STATE_UPDATE,
                payload: { gameState }
              }
            ));
          }
        }
      }
        break;

      case GameMessageType.INFO:
        {
          const sockets = lobbyService.getRoomSockets(
            lobbyService.getRoomIdFromSocket(socket as unknown as WSRoom),
          );
          for (const socket of sockets) {
            socket.send('Room message');
          }
        }
        break;

      default:
        req.server.log.warn(`Type: message type ${message.type} unknown`);
        break;
    }
  });

  socket.on('close', () => {
    clearInterval(lobbyUpdateInterval);
    lobbyService.leaveRoom(socket as unknown as WSRoom)
  });
}

export async function playGame(connection: SocketStream, req: FastifyRequest) {
  const { token } = req.query as { token: string };
  const { authService, gameService } = req.server;
  const server = req.server.websocketServer;
  const messageService = new MessageService(server);

  const { sub: playerId, name } = authService.decodeAuthToken(token);
  const { gameId } = req.params as { gameId: string };

  const game = await gameService.findGameById(gameId);
  if (!game) {
    messageService.emitErrorMessage(`GAME_NOT_FOUND|Game ${gameId} not found!`);
    throw new GameError('Game not found', gameId);
  }
  if (game && game.state === GameStatus.FINISHED) {
    messageService.emitErrorMessage(
      `GAME_FINISHED|Game ${gameId} already finished!`,
    );
    throw new GameError('Game not found', gameId);
  }

  if (server.clients.size > 2) {
    connection.socket.send(
      messageService.getInfoMessage(`Game full, try create new game`),
    );
    connection.socket.close();
  }

  gameService.createGameBoard(3, gameId);
  const state = gameService.addGamePlayer(gameId, playerId, name ?? '-');
  if (state) {
    messageService.emitStateMessage(state);
  }

  if (server.clients.size === 2) {
    messageService.emitInfoMessage('Second player joined, starting game');
    await gameService.setGameState(gameId, GameStatus.STARTED);
  }

  connection.socket.on('close', () => {
    // Last client is disconnecting
    if (server.clients.size === 1) {
      // TODO Delete game by id
    }
  });

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
