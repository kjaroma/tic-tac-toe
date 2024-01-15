import BoardCell from "./BoardCell"
import useGame from "../../hooks/useGame"
import { GameValidationStatus } from "../../shared/types"
import { linearTo2dIndex } from "../../shared/array"
import GameId from "./GameId"
import ConnectionStatus from "./ConnectionStatus"
import Profiles from "./Profiles"
import GameStatusComponent from "./GameStatusComponent"
import { useMemo } from "react"

function TicTacToeBoard() {

    const { gameState, onCellClick, readyState, roomId } = useGame()

    return (useMemo(() => {
        const { board, validation, players, currentPlayerId } = gameState

        const isHighlighted = (currCol: number, currRow: number) => {
            if (validation.status === GameValidationStatus.WIN) {
                return validation.result.some(idx => {
                    const { row, col } = linearTo2dIndex(idx, board.length)
                    return col === currCol && row === currRow
                })
            }
            return false
        }

        console.log("board-render")

        return (
            <div className="flex flex-col justify-center sm:flex-row bg-gray-5000 relative">
                {/* <RematchOverlay validation={validation} onGameCreate={onGameCreate} /> */}
                <div className="flex flex-col justify-center items-center bg-gray-900 p-4 rounded-xl">
                    {board.map((row, rIdx) => <div key={rIdx} className="flex flex-row">
                        {row.map((_, cIdx) => (
                            <BoardCell key={`${cIdx}_${rIdx}`}
                                onCellClick={onCellClick(cIdx, rIdx)}
                                cellValue={board[cIdx][rIdx] ?? " "}
                                winHighlight={isHighlighted(rIdx, cIdx)} />
                        ))}
                    </div>)}
                </div>
                <div className="pt-6 px-6 w-96">
                    <GameId gameId={roomId ?? ""} />
                    <ConnectionStatus readyState={readyState} />
                    <Profiles players={players} currentPlayerId={currentPlayerId} />
                    <GameStatusComponent validation={validation} players={players} currentPlayerId={currentPlayerId} />
                </div>
            </div>
        )
    }, [gameState, onCellClick, roomId, readyState])
    )
}

export default TicTacToeBoard