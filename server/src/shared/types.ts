// Shared types used both on server and client
export type BoardPlayerMove = 'x' | 'o';
export type BoardValue = BoardPlayerMove | null;
export type Board = (BoardValue | null)[][];
