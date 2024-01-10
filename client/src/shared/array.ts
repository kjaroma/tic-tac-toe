export const generate2DArray = (size: number, defaultValue: " "): string[][] =>
    Array.from({ length: size }, () =>
        Array.from({ length: size }, () => defaultValue),
    );

export const linearTo2dIndex = (linearIndex: number, boardSize: number) => {
    const row = Math.floor(linearIndex / boardSize)
    const col = linearIndex % boardSize
    return { col, row }
}