import { linearTo2dIndex } from "./array";

describe('linearTo2dIndex function', () => {
    it('should convert linear index to row and column for a 3x3 board', () => {
        const boardSize = 3;

        expect(linearTo2dIndex(0, boardSize)).toEqual({ col: 0, row: 0 });
        expect(linearTo2dIndex(4, boardSize)).toEqual({ col: 1, row: 1 });
        expect(linearTo2dIndex(8, boardSize)).toEqual({ col: 2, row: 2 });
    });

    it('should convert linear index to row and column for a 5x5 board', () => {
        const boardSize = 5;

        expect(linearTo2dIndex(0, boardSize)).toEqual({ col: 0, row: 0 });
        expect(linearTo2dIndex(7, boardSize)).toEqual({ col: 2, row: 1 });
        expect(linearTo2dIndex(15, boardSize)).toEqual({ col: 0, row: 3 });
    });
});