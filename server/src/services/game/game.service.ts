import { Game } from '@prisma/client';
import { GameRepository } from '../../repositories/GameRepository';
import { ApiError } from '../../common/errors';
import { ErrorMessages, HttpStatus } from '../../common/constants';
import { GameStatus } from '../../shared/types';
import { IGameService } from '../interfaces/IGameService';
import { GameState, TTTGame } from './tttgame';

class GameService implements IGameService {
  private games: Record<string, TTTGame> = {};

  constructor(private readonly gameRepository: GameRepository) {}

  public async setGameHost(id: string, hostId: string): Promise<Game | never> {
    try {
      return await this.gameRepository.update(
        { id },
        {
          hostId,
        },
      );
    } catch (e) {
      throw new ApiError(
        ErrorMessages.Game.UpdateFailed,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async setGameGuest(
    id: string,
    guestId: string,
  ): Promise<Game | never> {
    try {
      return await this.gameRepository.update({ id }, {
        guestId,
      } as Game);
    } catch (e) {
      throw new ApiError(
        ErrorMessages.Game.UpdateFailed,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async setGameState(
    id: string,
    state: GameStatus,
  ): Promise<Game | never> {
    try {
      return await this.gameRepository.update({ id }, {
        state,
      } as Game);
    } catch (e) {
      throw new ApiError(
        ErrorMessages.Game.UpdateFailed,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async saveGame(id: string, gameData: Partial<Game>) {
    try {
      return await this.gameRepository.update({ id }, {
        state: GameStatus.FINISHED,
        winnerId: gameData,
      } as Game);
    } catch (e) {
      throw new ApiError(
        ErrorMessages.Game.UpdateFailed,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async createGame(): Promise<Game | never> {
    try {
      return await this.gameRepository.create({
        state: GameStatus.CREATED,
      } as Game);
    } catch (e) {
      throw new ApiError(
        ErrorMessages.Game.CreationFailed,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findGameById(id: string): Promise<Game | null> {
    const game = await this.gameRepository.findUnique({ id });
    return game;
  }

  public async createGameBoard(
    boardSize: number,
    gameId: string,
  ): Promise<void> {
    // TODO Fetch user names
    const game = await this.findGameById(gameId);
    if (game) {
      this.games[gameId] = new TTTGame(gameId, boardSize);
      this.games[gameId].addPlayer(game.hostId as string);
      this.games[gameId].addPlayer(game.guestId as string);
    }
  }

  public setBoardMove(
    gameId: string,
    col: number,
    row: number,
    playerId: string,
  ): GameState {
    return this.games[gameId].makeMove(col, row, playerId);
  }
}

export default GameService;
