import { Game } from '@prisma/client';
import { GameRepository } from '../../repositories/GameRepository';
import GameValidator from '../gameValidator/gameValidator.service';
import { IGameService } from '../interfaces/IGameService';
import {
  IGameValidatorService,
} from '../interfaces/IGameValidatorService';
import { ApiError } from '../../common/errors';
import { ErrorMessages, HttpStatus } from '../../common/constants';
import { Board, BoardValue, GameMove, GameState } from '../../shared/types';

enum PlayerType {
  HOST = 'host',
  GUEST = 'guest'
}

type Player = {
  type: PlayerType,
  id: string
}

class GameService {
  private board: Board = [];
  private winningIndexes: number[] = [];
  private validatorService: IGameValidatorService;
  public random = 0
  private players: Player[] = []
  private currentPlayer?: string
  private history: GameMove[] = []

  // TODO Remove board size hardcoded value
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly boardSize = 3,
  ) {
    this.createBoard(boardSize);
    this.validatorService = new GameValidator(boardSize);
    this.random = Math.random()
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

  public createBoard(boardSize: number) {
    this.board = Array.from({ length: boardSize }, () =>
      Array.from({ length: boardSize }, () => null),
    );
  }

  public setMove(col: number, row: number) {
    if (col > this.boardSize - 1 || row > this.boardSize - 1) {
      // Illegal move for this board size
      console.log("Illegal move for board size")
      return;
    }
    if (this.board[col][row] !== null) {
      // Board cell already used
      console.log("Cell in use")
      return;
    }
    this.board[col][row] = this.currentPlayer as BoardValue;
    this.swapPlayers();
    this.addMoveToHistory(col, row, this.currentPlayer as string)
  }

  private addMoveToHistory(column: number, row: number, playerId: string) {
    this.history.push({
      playerId,
      position: {
        column, row
      } 
    })
  }

  private swapPlayers() {
    this.currentPlayer = this.players.filter(pl => pl.id !== this.currentPlayer)[0].id
  }

  private validateBoard() {
    const indexes = this.validatorService.validate(this.board, "x");
    if (indexes.length) {
      this.winningIndexes = indexes;
    }
  }

  public printBoard() {
    console.log(
      this.board
        .map((r) => r.map((el) => (el === null ? ' '.padStart(3) : el.padStart(3))).join('|'))
        .join('\n'),
    );
  }

  public addPlayer(id: string) {
    if (this.players.length >= 2) {
      console.log("Too many players")
      return
    }
    if (this.players.length === 0) {
      this.players.push({
        type: PlayerType.HOST,
        id
      })
    } else {
      this.players.push({
        type: PlayerType.GUEST,
        id
      })
      this.currentPlayer = this.players[0].id
    }
  }

  public dump() {
    console.log(JSON.stringify(this, null, 2))
  }
}

export default GameService;
