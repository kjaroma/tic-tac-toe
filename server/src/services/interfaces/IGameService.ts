import { BoardValue } from "./IGameValidatorService";

export interface IGameService {
    setMove(col: number, row: number, value: BoardValue): void
    printBoard(): void
}