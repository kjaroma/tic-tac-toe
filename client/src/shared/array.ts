export const generate2DArray = (size: number, defaultValue: " "): string[][] =>
    Array.from({ length: size }, () =>
        Array.from({ length: size }, () => defaultValue),
    );