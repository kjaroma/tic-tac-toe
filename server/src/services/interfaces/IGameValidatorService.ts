import { Board, BoardValue } from "../../shared/types";

export interface IGameValidatorService {
  validate: (board: Board, value: BoardValue) => number[]
}