import { FastifyRequest } from 'fastify';
import { SocketStream } from '@fastify/websocket';
import {
  GameMessageType,
  GameStatus,
  GameValidationStatus,
} from '../../shared/types';
import { GameError } from '../../common/errors';
import { WSRoom } from '../../types';
import { GameMessage } from '../../shared/messages';
import { GamePlayQueryType } from './game.schemas';

export async function playGame(connection: SocketStream, req: FastifyRequest) {
  const { token } = req.query as GamePlayQueryType;
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
    req.server.log.info(type, payload);

    // Handlers
    function createRoomHandler() {
      const roomId = lobbyService.createRoom(socket as unknown as WSRoom);
      gameService.createGameBoard(3, roomId);
      gameService.addGamePlayer(roomId, playerId, name ?? '-');
      socket.send(
        JSON.stringify({
          type: GameMessageType.ROOM_CREATED,
          payload: { roomId },
        }),
      );
    }

    function joinRoomHandler() {
      const roomId = lobbyService.joinRoom(
        payload.roomId,
        socket as unknown as WSRoom,
      );
      if (roomId) {
        socket.send(
          JSON.stringify({
            type: GameMessageType.ROOM_JOINED,
            payload: { roomId },
          }),
        );
        const gameState = gameService.addGamePlayer(
          roomId,
          playerId,
          name ?? '-',
        );
        if (gameState) {
          const sockets = lobbyService.getRoomSockets(
            lobbyService.getRoomIdFromSocket(socket as unknown as WSRoom),
          );
          for (const socket of sockets) {
            socket.send(
              JSON.stringify({
                type: GameMessageType.STATE_UPDATE,
                payload: { gameState },
              }),
            );
          }
        }
      }
    }

    function leaveRoomHandler() {
      const roomId = lobbyService.getRoomIdFromSocket(
        socket as unknown as WSRoom,
      );
      const isClosed = lobbyService.leaveRoom(socket as unknown as WSRoom);
      if (isClosed) {
        gameService.deleteGame(roomId);
      }
    }

    function makeMoveHandler() {
      const roomId = lobbyService.getRoomIdFromSocket(
        socket as unknown as WSRoom,
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { col, row } = payload as any; // TODO proper type
      let gameState;
      try {
        gameState = gameService.setBoardMove(roomId, col, row, playerId);
        const { validation, board, history, players } = gameState;
        if (
          validation.status === GameValidationStatus.TIE ||
          validation.status === GameValidationStatus.WIN
        ) {
          gameService.saveGame({
            state: GameStatus.FINISHED,
            // TODO Handle tie
            // TODO Refactor this
            hostId: players.find((pl) => pl.type === 'host')?.id ?? null,
            guestId: players.find((pl) => pl.type === 'guest')?.id ?? null,
            winnerId: validation.winnerId ?? null,
            gameData: { board, history },
            boardSize: 3,
          });
        }
      } catch (e) {
        if (e instanceof GameError) {
          if (e.message === 'It is not your turn now') {
            const sockets = lobbyService.getRoomSockets(
              lobbyService.getRoomIdFromSocket(socket as unknown as WSRoom),
            );
            for (const socket of sockets) {
              socket.send(
                JSON.stringify({
                  type: GameMessageType.STATE_UPDATE,
                  payload: { gameState },
                }),
              );
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
          socket.send(
            JSON.stringify({
              type: GameMessageType.STATE_UPDATE,
              payload: { gameState },
            }),
          );
        }
      }
    }

    function infoHandler() {
      const sockets = lobbyService.getRoomSockets(
        lobbyService.getRoomIdFromSocket(socket as unknown as WSRoom),
      );
      for (const socket of sockets) {
        socket.send('Room message');
      }
    }

    switch (type as GameMessageType) {
      case GameMessageType.CREATE_ROOM:
        createRoomHandler();
        break;

      case GameMessageType.JOIN_ROOM:
        joinRoomHandler();
        break;

      case GameMessageType.LEAVE:
        leaveRoomHandler();
        break;

      case GameMessageType.MAKE_MOVE:
        makeMoveHandler()
        break;

      case GameMessageType.INFO:
        infoHandler()
        break;

      default:
        req.server.log.warn(`Type: message type ${message.type} unknown`);
        break;
    }
  });

  socket.on('close', () => {
    clearInterval(lobbyUpdateInterval);
    const roomId = lobbyService.getRoomIdFromSocket(socket as unknown as WSRoom)
    const isClosed = lobbyService.leaveRoom(socket as unknown as WSRoom);
    if (isClosed) {
      gameService.deleteGame(roomId)
    }
  });
}
