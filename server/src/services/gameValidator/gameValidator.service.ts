import { Board, BoardValue } from '../../shared/types';
import { generate2DArray, transposeArray } from '../../utils/array';
import { IGameValidatorService } from '../interfaces/IGameValidatorService';

class GameValidator implements IGameValidatorService {
  winningIndexMap: number[][] = [];
  constructor(private readonly boardSize: number) {
    this.generateWinMap();
  }

  private generateWinMap() {
    const board = generate2DArray(this.boardSize, null);
    // Generate indexes of flatten board for row win
    const rows = board.map((row, ridx) =>
      row.map((_, idx) => ridx * this.boardSize + idx),
    );
    // The same for cols, just transpose array
    const cols = transposeArray(rows);
    // Add diagonal win
    const diagTL = rows.map((row, idx) => row[idx]);
    // Another diagonal win
    const diagTR = rows.map((row, idx) => row[row.length - idx - 1]);
    // Get the middle board index
    const middleIndex = Math.floor(this.boardSize / 2);
    // Cover double win when winning combination has cross pattern
    const doubleWin = Array.from(
      new Set([...rows[middleIndex], ...cols[middleIndex]]),
    ).sort();
    // Put double win first, as it's also covered by the rows and cols win combinations
    const winMap = [doubleWin, ...rows, ...cols, diagTL, diagTR];
    this.winningIndexMap = winMap;
  }

  public validate(board: Board, value: BoardValue): number[] {
    const flatten = board.flat();
    const result = this.winningIndexMap.find((combination) => {
      return combination.every((index) => {
        return flatten[index] === value;
      });
    });
    return result ?? [];
  }
}

export default GameValidator;
