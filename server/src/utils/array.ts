export const transposeArray = <T>(array: T[][]): T[][] => array[0]
  .map((_, colIndex) => array.map(row => row[colIndex]));

export const generate2DArray = <T>(size: number, defaultValue: T): T[][] => Array.from({ length: size }, () => Array.from({ length: size }, () => defaultValue))
