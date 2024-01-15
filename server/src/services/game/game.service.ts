import { Game } from '@prisma/client';
import { GameRepository } from '../../repositories/GameRepository';
import { ApiError } from '../../common/errors';
import { ErrorMessages, HttpStatus } from '../../common/constants';
import { GameState, GameStatus } from '../../shared/types';
import { IGameService } from '../interfaces/IGameService';
import { TTTGame } from './game';

class GameService implements IGameService {
  private games: Record<string, TTTGame> = {};

  constructor(private readonly gameRepository: GameRepository) {}

  public async saveGame(data: Omit<Game, 'id'>) {
    try {
      return await this.gameRepository.create({
        ...data, state: GameStatus.FINISHED} as Game);
    } catch (e) {
      throw new ApiError(
        ErrorMessages.Game.UpdateFailed,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async createGameBoard(
    boardSize: number,
    gameId: string,
  ): Promise<void> {
    if (!this.games[gameId]) {
      this.games[gameId] = new TTTGame(gameId, boardSize);
    }
  }

  public addGamePlayer(
    gameId: string,
    playerId: string,
    playerName: string,
  ): GameState | undefined {
    return this.games[gameId].addPlayer(playerId, playerName);
  }

  public setBoardMove(
    gameId: string,
    col: number,
    row: number,
    playerId: string,
  ): GameState {
    return this.games[gameId].makeMove(col, row, playerId);
  }

  public deleteGame(gameId: string) {
    delete this.games[gameId];
  }
}

export default GameService;
