import { Board, BoardValue } from "../../shared/types"
import GameValidator from "./gameValidator.service"

describe('gameValidator', () => {
    describe('it should validate 3x3 boards', () => {

        const validator = new GameValidator(3)
        const testCases = [
            {
                board: [
                    ["x", "x", "x"],
                    ["o", null, null],
                    ["x", "o", "x"],
                ],
                description: 'it should validate winning row',
                expected: [0, 1, 2],
                value: "x"

            },
            {
                board: [
                    ["o", "x", "x"],
                    ["o", null, null],
                    ["o", "o", "x"],
                ],
                description: 'it should validate winning column',
                expected: [0, 3, 6],
                value: "o",

            },
            {
                board: [
                    ["x", null, "x"],
                    ["o", "x", null],
                    ["x", "o", "x"],
                ],
                description: 'it should validate winning diagonal',
                expected: [0, 4, 8],
                value: "x",

            },
            {
                board: [
                    ["o", "x", "o"],
                    ["x", "x", "x"],
                    ["o", "x", "o"],
                ],
                description: 'it should validate winning double win before row',
                expected: [1, 3, 4, 5, 7],
                value: "x",

            },
            {
                board: [
                    ["o", "x", "o"],
                    ["x", null, "x"],
                    ["o", "x", "o"],
                ],
                description: 'it should validate board without winner for `x` player',
                expected: [],
                value: "x",

            },
            {
                board: [
                    ["o", "x", "o"],
                    ["x", null, "x"],
                    ["o", "x", "o"],
                ],
                description: 'it should validate board without winner for `o` player',
                expected: [],
                value: "o",

            },
        ]
        for (let test of testCases) {
            const { description, board, expected, value } = test
            it(description, () => {
                expect(validator.validate(board as Board, value as BoardValue)).toStrictEqual(expected)
            })
        }

    })
    describe('it should validate different board sizes', () => {
        const testCases = [
            {
                board: [
                    [null, null, null, null, null],
                    ["x", "x", "x", "x", "x"],
                    ["o", null, null, "o", null],
                    [null, "o", null, null, null],
                    ["o", null, null, "o", null],
                ],
                description: 'it should validate winning 5x5 board',
                expected: [5, 6, 7, 8, 9],
                value: "x"
            },
            {
                board: [
                    [null, null, null, null, null],
                    ["x", "o", "x", "x", "x"],
                    ["o", null, null, "o", null],
                    [null, null, null, null, null],
                    ["o", null, null, "o", null],
                ],
                description: 'it should validate 5x5 board without the winner',
                expected: [],
                value: "x"
            }
        ]
        const validator = new GameValidator(5)
        for (let test of testCases) {
            const { description, board, expected, value } = test
            it(description, () => {
                expect(validator.validate(board as Board, value as BoardValue)).toStrictEqual(expected)
            })
        }
    })
})