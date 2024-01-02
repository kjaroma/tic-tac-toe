export type BoardPlayerMove = 'x' | 'o'
export type BoardValue = BoardPlayerMove | null
export type Board = (BoardValue | null)[][]

export interface IGameValidatorService {
  validate: (board: Board) => BoardValue
}