export type BoardPlayerMove = 'x' | 'o'
export type BoardValue = BoardPlayerMove | null
export type Board = (BoardValue | null)[][]

export interface IBoardValidator {
  validate: (board: Board) => BoardValue
}

export enum GameMessageTypes {
  BOARD_CREATED = 'BOARD_CREATED',
  PLAYER_MOVE = 'PLAYER_MOVE',
}

