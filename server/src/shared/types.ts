// Shared types used both on server and client
export type BoardValue = BoardSymbol | null;
export type Board = (BoardValue | null)[][];

export enum BoardSymbol {
  X = 'x',
  O = 'o'
}

export enum GameState {
  CREATED = 'created',
  STARTED = 'started',
}

export enum GameMessageTypes {
  BOARD_CREATED = 'BOARD_CREATED',
  PLAYER_MOVE = 'PLAYER_MOVE',
}

export enum GameValidationStatus {
  NONE = 'none',
  WIN = 'win',
  TIE ='tie',
}

type GamePosition = {
  column: number;
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

type GameData = {
  id: string;
  players: {
    host: GamePlayer;
    guest: GamePlayer;
  };
  winner: string;
  moves: GameMove;
};
