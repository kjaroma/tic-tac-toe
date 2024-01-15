import { Room } from "../components/lobby/LobbyTable";

// Shared types used both on server and client
export type BoardValue = BoardSymbol | null;
export type Board = (BoardValue | null)[][];

export enum BoardSymbol {
  X = 'x',
  O = 'o',
}

export enum GameStatus {
  CREATED = 'created',
  STARTED = 'started',
  FINISHED = 'finished',
}

export enum GameMessageType {
  ROOM_CREATED = 'room_created',
  ROOM_JOINED = 'room_joined',
  ROOM_LEFT = 'room_left',
  LOBBY_UPDATE = 'lobby_update',
  STATE_UPDATE = 'state_update',

  // Common messages
  INFO = 'info',
  ERROR = 'error',

  // Client messages
  CREATE_ROOM = 'create_room',
  JOIN_ROOM = 'join_room',
  LEAVE_ROOM = 'leave_room',
  GAME_START = 'game_start',
  MAKE_MOVE = 'make_move',
  FINISH = 'finish',
}

export type GameMessageRoomCreatedPayload = {
    roomId: string
}

export type GameMessageRoomJoinedPayload = {
    roomId: string
}

export type GameMessageStateUpdatePayload = {
    gameState: GameState
}

export type GameMessageErrorPayload = {
    message: string
}

export type GameMessageInfoPayload = {
    message: string
}

export type GameMessageLobbyUpdate = {
    rooms: Room[]
}

export type GameMessagePayload = Record<string, unknown>

export type GameMessage = {
    type: keyof typeof GameMessageType,
    payload: GameMessagePayload
}

export enum GameValidationStatus {
  NONE = 'none',
  WIN = 'win',
  TIE = 'tie',
}

type GamePosition = {
  col: number;
  row: number;
};

export type GameMove = {
  playerId: string;
  position: GamePosition;
};

export type GamePlayer = {
  id: string;
  name: string;
};

export type GameData = {
  board: Board;
  winnerId: string;
  history: GameMove;
};

enum PlayerType {
  HOST = 'host',
  GUEST = 'guest',
}

export type Player = {
  type: PlayerType;
  name: string;
  id: string;
  symbol: BoardSymbol;
};

export type GameValidation = {
  status: GameValidationStatus;
  winnerId?: string;
  result: number[];
};

export type GameState = {
  board: Board;
  players: Player[];
  currentPlayerId: string;
  validation: GameValidation;
  history: GameMove[];
};