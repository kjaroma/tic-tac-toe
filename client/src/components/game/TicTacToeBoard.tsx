import useWebSocket from "react-use-websocket"
import { URLS } from "../../constants"
import { useEffect } from "react"
import { useAuth } from "../../hooks/useAuth"
import BoardCell from "./BoardCell"
import GameId from "./GameId"
import useGame from "../../hooks/useGame"
import ConnectionStatus from "./ConnectionStatus"
import Profiles from "./Profiles"
import GameStatusComponent from "./GameStatusComponent"

type TicTacToeBoardProps = {
    gameId: string
}

function TicTacToeBoard({ gameId }: TicTacToeBoardProps) {
    const { accessToken } = useAuth().userAuthData ?? {}
    const { currentPlayerId, board, validation, players, setGameState, isHighlighted } = useGame()

    const url = `${URLS.joinGame}${gameId}?token=${accessToken}`
    const { sendMessage, lastMessage, readyState } = useWebSocket(url, { share: false })

    useEffect(() => {
        if (lastMessage !== null) {
            const message = JSON.parse(lastMessage.data)
            switch (message.type) {
                case 'state_update':
                    console.log(message.payload.state)
                    setGameState(message.payload.state)
                    break
                case 'info':
                    // TODO Handle log
                    break
                default:
                    break;
            }
        }
  
    }, [lastMessage, setGameState])

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
        <div className="flex flex-col justify-center sm:flex-row bg-gray-5000">
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
            <div className="p-6 w-96">
                <GameId gameId={gameId} />
                <ConnectionStatus readyState={readyState} />
                <Profiles players={players} currentPlayerId={currentPlayerId} />
                <GameStatusComponent validation={validation} players={players} currentPlayerId={currentPlayerId} />
            </div>
        </div>
    )
}

export default TicTacToeBoard