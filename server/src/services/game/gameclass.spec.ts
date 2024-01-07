import { GameError } from "../../common/errors"
import { BoardSymbol } from "../../shared/types"
import { Game } from "./game"

describe('game', () => {
    it('should create empty board', () => {
        const game = new Game('id', 3)
        expect(game.board.flat().length).toBe(9)
        expect(game.board.flat().find(el => el !== null)).toBeUndefined()
    })
    it('should throw adding more than 2 players to the game', () => {
        const game = new Game('id', 3)
        game.addPlayer('pl1')
        game.addPlayer('pl2')
        expect(game['players'].length).toBe(2)
        expect(() => game.addPlayer('pl3')).toThrow()
    })
    describe('boardMoves', () => {
        const game = new Game('id', 3)
        game.addPlayer('pl1')
        game.addPlayer('pl2')
        it('should register moves properly on a board', () => {
            game.makeMove(0, 0)
            game.makeMove(2, 2)
            expect(game.board).toStrictEqual([[BoardSymbol.X, null, null], [null, null, null], [null, null, BoardSymbol.O]])
        })
        it('should throw when illegal move has been made', () => {
            expect(() => game.makeMove(0, 0)).toThrow('Illegal move, board cell in use')
        })
        it('should throw when move is outside of the board', () => {
            expect(() => game.makeMove(10, 10)).toThrow('Illegal move for given board size')
        })
    })
})