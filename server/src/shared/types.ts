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
  // Server messages
  ROOM_CREATED = 'room_created',
  ROOM_JOINED = 'room_joined',
  ROOM_LEFT = 'room_left',
  LOBBY_UPDATE = 'lobby_update',

  //
  CREATE_ROOM = 'create_room',
  JOIN_ROOM = 'join_room',
  LEAVE_ROOM = 'leave_room',
  MAKE_MOVE = 'make_move',
  STATE_UPDATE = 'state_update',
  ERROR = 'error',
  INFO = 'info',
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

export enum PlayerType {
  HOST = 'host',
  GUEST = 'guest',
}

export type Player = {
  type: PlayerType;
  id: string;
  name: string;
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
