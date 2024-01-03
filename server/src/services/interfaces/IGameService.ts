import { Game } from "@prisma/client";
import { BoardValue } from "./IGameValidatorService";

export interface IGameService {
    createGame(): Promise<Game | never>
    findGameById(id: string): Promise<Game | null>
    updateGame(id: string, game: Omit<Game, 'id'>): Game
    setMove(col: number, row: number, value: BoardValue): void
    printBoard(): void
}