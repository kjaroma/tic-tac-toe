import { Game } from '@prisma/client';
import { GameState, GameStatus } from '../../shared/types';

export interface IGameService {
  createGame(): Promise<Game | never>;
  findGameById(id: string): Promise<Game | null>;
  setGameHost(id: string, hostId: string): Promise<Game | never>;
  setGameGuest(id: string, guestId: string): Promise<Game | never>;
  setGameState(id: string, state: GameStatus): Promise<Game | never>;
  createGameBoard(boardSize: number, gameId: string): void;
  addGamePlayer(
    gameId: string,
    playerId: string,
    playerName: string,
  ): GameState | undefined;
  setBoardMove(
    gameId: string,
    col: number,
    row: number,
    playerId: string,
  ): GameState;
}
