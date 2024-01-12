import { useEffect, useState } from "react";
import { Board, GameState, GameValidationStatus } from "../shared/types";
import { generate2DArray, linearTo2dIndex } from "../shared/array";

const initialGameState: GameState = {
        board: generate2DArray(3, " ") as Board,
        history: [],
        players: [],
        currentPlayerId: "",
        validation: {
            status: GameValidationStatus.NONE,
            result: []
        }
}

function useGame(gameId: string) {

    const [gameState, setGameState] = useState<GameState>(initialGameState)

    const {currentPlayerId, board, history, validation, players} = gameState

    const isHighlighted = (currCol: number, currRow: number) => {
        if(validation.status === GameValidationStatus.WIN) {
            return validation.result.some(idx => {
                const {row, col} = linearTo2dIndex(idx, board.length)
                return col === currCol && row === currRow
            })
        }
        return false
    }

    useEffect(() => {
        setGameState(initialGameState)
    }, [gameId])

    return ({
        setGameState,
        isHighlighted,
        currentPlayerId,
        board,
        history,
        validation,
        players
        }
    )
}

export default useGame