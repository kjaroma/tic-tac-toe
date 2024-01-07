import { BoardSymbol, GameValidationStatus } from "../../shared/types"
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
            game.makeMove(0, 0, 'pl1')
            game.makeMove(2, 2, 'pl2')
            expect(game.board).toStrictEqual([[BoardSymbol.X, null, null], [null, null, null], [null, null, BoardSymbol.O]])
        })
        it('should throw when illegal move has been made', () => {
            expect(() => game.makeMove(0, 0, 'pl1')).toThrow('Illegal move, board cell in use')
        })
        it('should throw when move is outside of the board', () => {
            expect(() => game.makeMove(10, 10, 'pl1')).toThrow('Illegal move for given board size')
        })
        it('should throw when it is not a players turn', () => {
            expect(() => game.makeMove(0, 2, 'pl2')).toThrow('It is not your turn now')
        })
        it('should throw when player is unknown', () => {
            expect(() => game.makeMove(2, 0, 'pl3')).toThrow('Unknown player Id')
        })
    })
    describe('gameState', () => {
        const mockedState = {
            board: [['x', null, null], [null, null, null], [null, 'o', 'x']],
            players: [
                { type: 'host', id: 'pl1', symbol: 'x' },
                { type: 'guest', id: 'pl2', symbol: 'o' }
            ],
            currentPlayerId: 'pl2',
            validation: { status: GameValidationStatus.NONE, result: [] }
        }

        const mockedWinState = {
            board: [['x', null, 'o'], [null, 'x', null], [null, 'o', 'x']],
            players: [
                { type: 'host', id: 'pl1', symbol: 'x' },
                { type: 'guest', id: 'pl2', symbol: 'o' }
            ],
            currentPlayerId: 'pl1',
            validation: { status: GameValidationStatus.WIN, winnerId: 'pl1', result: [0, 4, 8] }
        }

        const game = new Game('id', 3)
        game.addPlayer('pl1')
        game.addPlayer('pl2')
        game.makeMove(0, 0, 'pl1')
        game.makeMove(2, 1, 'pl2')
        let state = game.makeMove(2, 2, 'pl1')
        expect(state).toStrictEqual(mockedState)
        game.makeMove(0, 2, 'pl2')
        state = game.makeMove(1,1, 'pl1')
        expect(state).toStrictEqual(mockedWinState)
    })
})