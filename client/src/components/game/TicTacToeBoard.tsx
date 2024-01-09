import useWebSocket from "react-use-websocket"
import { URLS } from "../../constants"
import { useEffect } from "react"
import { useAuth } from "../../hooks/useAuth"
import BoardCell from "./BoardCell"
import GameId from "./GameId"
import useGame from "../../hooks/useGame"
import ConnectionStatus from "./ConnectionStatus"

type TicTacToeBoardProps = {
    gameId: string
} 

function TicTacToeBoard({ gameId }: TicTacToeBoardProps) {
    const { accessToken, userId, name } = useAuth().userAuthData ?? {}
    const { currentPlayerId, board, history, setGameState  } = useGame()

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
                default:
                    break;
            }
        }

    }, [lastMessage, setGameState ])

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
        <div className="flex flex-col justify-center">
            <p>{name}{userId}</p>
            {currentPlayerId === userId ? <h2>Tour turn</h2> : <h4>Not you</h4>}
            <GameId gameId={gameId} />
            <ConnectionStatus readyState={readyState} />
            <div className="flex flex-col float-start">
                {board.map((row, rIdx) => <div key={rIdx} className="flex flex-row">
                    {row.map((_, cIdx) => <BoardCell key={`${cIdx}_${rIdx}`} onCellClick={handleCellClick(cIdx, rIdx)} cellValue={board[cIdx][rIdx] ?? " "} />)}
                </div>)}
            </div>
            {history.map((m, i) => <div className="text-xs" key={i}>{JSON.stringify((m as any).data)}</div>)}
            {JSON.stringify(currentPlayerId)}
        </div>
    )
}

export default TicTacToeBoard