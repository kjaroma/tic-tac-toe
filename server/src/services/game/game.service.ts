import { Game, Prisma } from "@prisma/client"
import { GameRepository } from "../../repositories/GameRepository"
import GameValidator from "../gameValidator/gameValidator.service"
import { IGameService } from "../interfaces/IGameService"
import { Board, BoardValue, IGameValidatorService } from "../interfaces/IGameValidatorService"
import { GameState } from "./types"
import { ApiError } from "../../common/errors"
import { ErrorMessages, HttpStatus } from "../../common/constants"

class GameService implements IGameService {
  private board: Board = []
  private winner: BoardValue | undefined
  private validatorService: IGameValidatorService

  // TODO Remove board size hardcoded value
  constructor(private readonly gameRepository: GameRepository, private readonly boardSize = 3) {
    this.createBoard(boardSize)
    this.validatorService = new GameValidator(boardSize)
  }

  public async setGameHost(game: Game, hostId: string): Promise<Game | never> {
    const { id, ...data } = game;
    try {
      return await this.gameRepository.update(
        { id },
        { ...data, hostId } as Game
      )
    } catch (e) {
      throw new ApiError(ErrorMessages.Game.UpdateFailed, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  public async setGameGuest(game: Game, guestId: string): Promise<Game | never> {
    const { id, ...data } = game;
    try {
      return await this.gameRepository.update(
        { id },
        { ...data, guestId } as Game
      )
    } catch (e) {
      throw new ApiError(ErrorMessages.Game.UpdateFailed, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  public async setGameState(game: Game, state: GameState): Promise<Game | never> {
    const { id, ...data } = game;
    try {
      return await this.gameRepository.update(
        { id },
        { ...data, state } as Game
      )
    } catch (e) {
      throw new ApiError(ErrorMessages.Game.UpdateFailed, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  public async createGame(): Promise<Game | never> {
    try {
      return await this.gameRepository.create({ state: GameState.CREATED } as Game)
    } catch (e) {
      throw new ApiError(ErrorMessages.Game.CreationFailed, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  public async findGameById(id: string): Promise<Game | null> {
    const game = await this.gameRepository.findUnique({ id })
    return game
  }

  private createBoard(boardSize: number) {
    this.board = Array.from({ length: boardSize }, () => Array.from({ length: boardSize }, () => null))
  }

  public setMove(col: number, row: number, value: BoardValue) {
    if (col > this.boardSize - 1 || row > this.boardSize - 1) {
      // Illegal move for this board size
      return
    }
    if (this.board[col][row] !== null) {
      // Board cell already used
      return
    }
    this.board[col][row] = value
    // this.validateBoard();
  }

  private validateBoard() {
    const winner = this.validatorService.validate(this.board)
    if (winner !== null) {
      this.winner = winner
    }
  }

  public printBoard() {
    console.log(this.board.map(r => r.map(el => el === null ? " " : el).join("|")).join('\n'))
  }
}

export default GameService
