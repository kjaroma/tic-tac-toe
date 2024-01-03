export enum GameState {
  CREATED = 'created',
  STARTED = 'started'
}

export enum GameMessageTypes {
  BOARD_CREATED = 'BOARD_CREATED',
  PLAYER_MOVE = 'PLAYER_MOVE',
}

type GamePosition = {
  column: number,
  row: number,
}

type GameMove = {
  player: string,
  position: GamePosition
}

type GameData = {
  id: string,
  players: {
    hostId: string,
    guestId: string,
  }
  winner: string,
  moves: GameMove
}