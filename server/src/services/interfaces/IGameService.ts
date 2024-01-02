import { BoardValue } from "./IGameValidatorService";

export interface IGameService {
    // start game?
    // join game?
    setMove(col: number, row: number, value: BoardValue): void
    printBoard(): void
}