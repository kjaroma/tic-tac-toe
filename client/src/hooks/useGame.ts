import { useState } from "react";
import { Board, GameState, GameValidationStatus } from "../shared/types";
import { generate2DArray } from "../shared/array";

const useGameInitialState: GameState = {
        board: generate2DArray(3, " ") as Board,
        history: [],
        players: [],
        currentPlayerId: "",
        validation: {
            status: GameValidationStatus.NONE,
            result: []
        }
}

function useGame() {

    const [gameState, setGameState] = useState<GameState>(useGameInitialState)
    const [log, setLog] = useState<string[]>([])

    const {currentPlayerId, board, history, validation} = gameState
    const storeInfoMessage = (message: string) => {
        setLog((log) => log.concat(message))
    }

    return ({
        storeInfoMessage,
        setGameState,
        currentPlayerId,
        board,
        history,
        log,
        validation
        }
    )
}

export default useGame