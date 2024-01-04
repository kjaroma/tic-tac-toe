import { Game } from '@prisma/client';
import { GameState } from '../game/types';
import { BoardValue } from '../../shared/types';

export interface IGameService {
  createGame(): Promise<Game | never>;
  findGameById(id: string): Promise<Game | null>;
  setGameHost(game: Game, hostId: string): Promise<Game | never>;
  setGameGuest(game: Game, guestId: string): Promise<Game | never>;
  setGameState(game: Game, state: GameState): Promise<Game | never>;
  setMove(col: number, row: number, value: BoardValue): void;
  printBoard(): void;
}
