import { transposeArray } from "../game/utils"
import { Board, BoardPlayerMove, BoardValue, IGameValidatorService } from "../interfaces/IGameValidatorService"

class GameValidator implements IGameValidatorService {
  private boardSize = 0
  constructor(boardSize: number) {
    this.boardSize = boardSize
  }

  private isBoardSizeValid(board: Board): boolean {
    return board.every(row => row.length === board.length)
  }

  public validate(board: Board): BoardValue {

    const getRowSet = (row: BoardValue[]): Set<BoardValue> | undefined => row.every(el => el !== null) ? new Set(row) : undefined

    if (!this.isBoardSizeValid(board)) {
      // Not square board
      // Throw new error
      return null
    }
    // Looking for a winner procedure:
    // - filter rows with all cells set,
    // - filter cols with all cells set,
    // - add diagonals if all cells set,
    // - create set from all filtered rows,
    // - find one set with length 1,
    // - get the set value,
    // - set value is the winner. 
    // Look for row winner
    const rowSets = board.map(getRowSet).filter(Boolean)
    const colSets = transposeArray(board).map(getRowSet).filter(Boolean)
    
    const topBottomDiagonalSet = board.map((row, idx) => row[idx])
    const bottomTopDiagonalSet = board.map((row, idx) => row[board.length - idx - 1])

    console.log(topBottomDiagonalSet, bottomTopDiagonalSet)

    const winningSet = [rowSets, colSets].find(set => (set as unknown as Set<BoardPlayerMove>).size === 1)
    if(winningSet) {
      return (winningSet as unknown as Set<BoardPlayerMove>).values().next().value
    }
    return null
  }
}

export default GameValidator
