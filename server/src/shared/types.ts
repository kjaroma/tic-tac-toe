// Shared types used both on server and client
export type BoardPlayerMove = 'x' | 'o';
export type BoardValue = BoardPlayerMove | null;
export type Board = (BoardValue | null)[][];

export enum GameState {
  CREATED = 'created',
  STARTED = 'started',
}

export enum GameMessageTypes {
  BOARD_CREATED = 'BOARD_CREATED',
  PLAYER_MOVE = 'PLAYER_MOVE',
}

type GamePosition = {
  column: number;
  row: number;
};

export type GameMove = {
  playerId: string;
  position: GamePosition;
};

type GameData = {
  id: string;
  players: {
    hostId: string;
    guestId: string;
  };
  winner: string;
  moves: GameMove;
};