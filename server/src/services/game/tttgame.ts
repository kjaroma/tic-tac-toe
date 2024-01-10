import { PlayerType } from './../../shared/types';
import { GameError } from '../../common/errors';
import {
  Board,
  BoardSymbol,
  GameMove,
  GameState,
  GameValidation,
  GameValidationStatus,
  Player,
} from '../../shared/types';
import GameValidator from '../gameValidator/gameValidator.service';
import { IGame } from '../interfaces/IGame';
import { generate2DArray } from '../../utils/array';

export class TTTGame implements IGame {
  public board: Board = [];
  private validatorService: GameValidator;
  private players: Player[] = [];
  private currentPlayerId?: string;
  private history: GameMove[] = [];

  constructor(
    private readonly gameId: string,
    private readonly boardSize: number,
  ) {
    this.createBoard(boardSize);
    this.validatorService = new GameValidator(boardSize);
  }

  private swapPlayers() {
    this.currentPlayerId = this.players.filter(
      (pl) => pl.id !== this.currentPlayerId,
    )[0].id;
  }

  private addMoveToHistory(col: number, row: number, playerId: string) {
    this.history.push({
      playerId,
      position: {
        col,
        row,
      },
    });
  }

  private getCurrentPlayer(): Player {
    return this.players.filter(({ id }) => id === this.currentPlayerId)[0];
  }

  private validateBoard(): GameValidation {
    const result = this.validatorService.validate(
      this.board,
      this.getCurrentPlayer().symbol,
    );
    if (result.length) {
      const id = this.players.find(
        (pl) => pl.symbol === this.getCurrentPlayer().symbol,
      )?.id;
      return {
        status: GameValidationStatus.WIN,
        winnerId: id,
        result,
      };
    }
    if (result.length === 0 && this.board.flat().every((el) => el !== null)) {
      return {
        status: GameValidationStatus.TIE,
        result,
      };
    }
    return {
      status: GameValidationStatus.NONE,
      result: [],
    };
  }

  private getGameState(): Omit<GameState, 'validation'> {
    return {
      board: this.board,
      players: this.players,
      currentPlayerId: this.currentPlayerId!,
      history: this.history,
    };
  }

  private setMove(col: number, row: number) {
    if (this.players.length < 2) {
      throw new GameError('Not enough players to start the game', this.gameId);
    }
    if (col > this.boardSize - 1 || row > this.boardSize - 1) {
      throw new GameError('Illegal move for given board size', this.gameId);
    }
    if (this.board[col][row] !== null) {
      throw new GameError('Illegal move, board cell in use', this.gameId);
    }
    this.board[col][row] = this.getCurrentPlayer().symbol;
  }

  public createBoard(boardSize: number) {
    this.board = generate2DArray(boardSize, null)
  }

  public addPlayer(id: string, name: string): GameState | undefined {
    if (this.players.length >= 2) {
      throw new GameError('Too many players', this.gameId);
    }
    if (this.players.length === 0) {
      this.players.push({
        type: PlayerType.HOST,
        name,
        id,
        symbol: BoardSymbol.X,
      });
    } else {
      this.players.push({
        type: PlayerType.GUEST,
        name,
        id,
        symbol: BoardSymbol.O,
      });
      this.currentPlayerId = this.players[0].id;
      return {
        ...this.getGameState(),
        validation: { status: GameValidationStatus.NONE, result: [] },
      };
    }
  }

  public makeMove(col: number, row: number, playerId: string): GameState {
    if (!this.players.some((pl) => pl.id === playerId)) {
      throw new GameError('Unknown player Id', this.gameId);
    }
    if (playerId !== this.currentPlayerId) {
      throw new GameError('It is not your turn now', this.gameId);
    }
    this.setMove(col, row);
    const validation = this.validateBoard();
    this.addMoveToHistory(col, row, this.currentPlayerId as string);
    if (validation.status === GameValidationStatus.NONE) {
      this.swapPlayers();
    }
    return {
      ...this.getGameState(),
      validation,
    };
  }
}
