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

    const {currentPlayerId, board, history, validation, players} = gameState

    return ({
        setGameState,
        currentPlayerId,
        board,
        history,
        validation,
        players
        }
    )
}

export default useGame