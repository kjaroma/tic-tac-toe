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
  MOVE = 'move',
  STATE_UPDATE = 'state_update',
  FINISH = 'finish',
  ERROR = 'error',
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
