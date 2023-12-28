import { Board } from "./types";

// TODO Add generic
export const transposeArray = (array: Board): Board => array[0]
  .map((_, colIndex) => array.map(row => row[colIndex]));

