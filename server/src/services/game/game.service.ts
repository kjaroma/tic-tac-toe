import GameValidator from "../gameValidator/gameValidator.service"
import { IGameService } from "../interfaces/IGameService"
import { Board, BoardValue, IGameValidatorService } from "../interfaces/IGameValidatorService"

class GameService implements IGameService {
  private board: Board = []
  private boardSize = 0
  private winner: BoardValue | undefined
  private validatorService: IGameValidatorService 

  constructor(boardSize = 3) {
    this.boardSize = boardSize
    this.createBoard(boardSize)
    this.validatorService = new GameValidator(boardSize)
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
    if(winner !== null) {
      this.winner = winner
    }
  }

  public printBoard() {
    console.log(this.board.map(r => r.map(el => el === null ? " " : el).join("|")).join('\n'))
  }
}

export default GameService
