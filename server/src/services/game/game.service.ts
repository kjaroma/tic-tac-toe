import { Game } from '@prisma/client';
import { GameRepository } from '../../repositories/GameRepository';
import { ApiError } from '../../common/errors';
import { ErrorMessages, HttpStatus } from '../../common/constants';
import { Board, GameState } from '../../shared/types';

class GameService {
  private games: Record<string, Board> = {};

  constructor(
    private readonly gameRepository: GameRepository,
    private readonly boardSize = 3,
  ) {
  }

  public async setGameHost(game: Game, hostId: string): Promise<Game | never> {
    const { id, ...data } = game;
    try {
      return await this.gameRepository.update({ id }, {
        ...data,
        hostId,
      } as Game);
    } catch (e) {
      throw new ApiError(
        ErrorMessages.Game.UpdateFailed,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async setGameGuest(
    game: Game,
    guestId: string,
  ): Promise<Game | never> {
    const { id, ...data } = game;
    try {
      return await this.gameRepository.update({ id }, {
        ...data,
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
    game: Game,
    state: GameState,
  ): Promise<Game | never> {
    const { id, ...data } = game;
    try {
      return await this.gameRepository.update({ id }, {
        ...data,
        state,
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
        state: GameState.CREATED,
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

  public createBoard(boardSize: number): void {
    console.log(boardSize)
    throw new Error('Not implemented')
  }
}

export default GameService;
