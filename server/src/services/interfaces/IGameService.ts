import { GameState } from '../../shared/types';

export interface IGameService {
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
  deleteGame(gameId: string): void
}
