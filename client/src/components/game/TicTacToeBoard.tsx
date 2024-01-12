import useWebSocket from "react-use-websocket"
import { URLS } from "../../constants"
import { useCallback, useEffect } from "react"
import { useAuth } from "../../hooks/useAuth"
import BoardCell from "./BoardCell"
import GameId from "./GameId"
import useGame from "../../hooks/useGame"
import ConnectionStatus from "./ConnectionStatus"
import Profiles from "./Profiles"
import GameStatusComponent from "./GameStatusComponent"
import RematchOverlay from "./RematchOverlay"

type TicTacToeBoardProps = {
    gameId: string
    onGameCreate: (gameId: string) => void
}

function TicTacToeBoard({ gameId, onGameCreate }: TicTacToeBoardProps) {
    const { accessToken, userId } = useAuth().userAuthData ?? {}
    const { currentPlayerId, board, validation, players, setGameState, isHighlighted } = useGame(gameId)

    const url = `${URLS.joinGame}${gameId}?token=${accessToken}`
    const { sendMessage, lastMessage, readyState } = useWebSocket(url, { share: false })

    useEffect(() => {
        if (lastMessage !== null) {
            const message = JSON.parse(lastMessage.data)
            switch (message.type) {
                case 'state_update':
                    setGameState(message.payload.state)
                    break
                case 'info':
                    // TODO Handle log
                    break
                case 'game_invitation':
                    if (message.payload.state.id === userId) {
                        onGameCreate(message.payload.state.gameId)
                    }
                    break
                default:
                    break;
            }
        }

    }, [lastMessage, setGameState, onGameCreate, userId])

    useEffect(() => {
        sendMessage(JSON.stringify({
            type: 'game_invitation',
            payload: {
                gameId,
                for: players.find(pl => pl.id !== userId)
            }
        }))
    }, [gameId, sendMessage, players, userId])

    const handleCellClick = (col: number, row: number) => {
        return (e: React.MouseEvent) => {
            e.preventDefault()
            sendMessage(JSON.stringify({
                type: 'move',
                payload: {
                    col, row
                }
            }))
        }
    }

    return (
        <div className="flex flex-col justify-center sm:flex-row bg-gray-5000 relative">
            <RematchOverlay validation={validation} onGameCreate={onGameCreate} />
            <div className="flex flex-col justify-center items-center bg-gray-900 p-4 rounded-xl">
                {board.map((row, rIdx) => <div key={rIdx} className="flex flex-row">
                    {row.map((_, cIdx) => (
                        <BoardCell key={`${cIdx}_${rIdx}`}
                            onCellClick={handleCellClick(cIdx, rIdx)}
                            cellValue={board[cIdx][rIdx] ?? " "}
                            winHighlight={isHighlighted(rIdx, cIdx)} />
                    ))}
                </div>)}
            </div>
            <div className="pt-6 px-6 w-96">
                <GameId gameId={gameId} />
                <ConnectionStatus readyState={readyState} />
                <Profiles players={players} currentPlayerId={currentPlayerId} />
                <GameStatusComponent validation={validation} players={players} currentPlayerId={currentPlayerId} />
            </div>
        </div>
    )
}

export default TicTacToeBoard