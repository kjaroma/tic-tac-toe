const board = [["x", " ", "o"], ["x", "x", "o"], ["o", " ", "x"]]


function validateBoardSize(board: string[][]) {
  return board.every(row => row.length === board.length)
}

const transposeArray = (array: string[][]): string[][] => array[0]
  .map((_, colIndex) => array.map(row => row[colIndex]));

const getRowResult = (row: string[]): boolean | string => {
  const set = row.map(row => (new Set(row).size === 1)).filter(Boolean)
  const value = set.values().next().value
  return value === ' ' ? false : value
}

function validateBoard(board: string[][]) {
  const rowWin = board.map(row => (new Set(row).size === 1)).filter(Boolean)
  if (rowWin) {
    return true
  }
  const columns = transposeArray(board)
  const colWin = board.some(row => (new Set(row).size === 1))
  if (colWin) {
    return true
  }
  const topBottomDiagonal = board.map((row, idx) => row[idx])
  const bottomTopDiagonal = board.map((row, idx) => row[board.length - idx - 1])
  console.log(topBottomDiagonal, bottomTopDiagonal)
  // Looks ok, but who won, return player1, player2 or tie?
  return false
}

console.log(board.join("\n"), "\n", transposeArray(board).join("\n"))

console.log(validateBoard(board), board, transposeArray(board))

