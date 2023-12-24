import BoardValidator from "./Validator"
import { Board, BoardValue, IBoardValidator } from "./types"

class Game {
  private board: Board = []
  private boardSize = 0
  private winner: BoardValue | undefined
  private validator: IBoardValidator 

  constructor(boardSize = 3) {
    this.boardSize = boardSize
    this.createBoard(boardSize)
    this.validator = new BoardValidator(boardSize)
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
    this.validateBoard();
  }

  private validateBoard() {
    const winner = this.validator.validate(this.board)
    if(winner !== null) {
      this.winner = winner
    }
  }

  public printBoard() {
    console.log(JSON.stringify(this.board, null, 2))
  }
}

export default Game
