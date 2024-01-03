import { generate2DArray, transposeArray } from "./array"

describe('Array utils', () => {
    describe('transposeArray', () => {
        it('should transpose array', () => {
            const arr = [
                [1, 2],
                [3, 4],
            ]
            const transposed = [
                [3, 1],
                [4, 2]
            ]
            transposeArray(arr).forEach((row, idx) => {
                expect(row.sort()).toStrictEqual(transposed[idx].sort())
            })
        })
    })
    describe('generate2DArray', () => {
        it('should generate empty 2d array with given value', () => {
            const arr = generate2DArray(2, "x")
            arr.forEach(row => {
                expect(row).toStrictEqual(["x", "x"])
            })
        })
    })
})