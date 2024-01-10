import { GameState } from '../../shared/types';

export interface IGame {
  createBoard(boardSize: number): void;
  addPlayer(id: string, name: string): GameState | undefined;
  makeMove(col: number, row: number, playerId: string): GameState;
}
