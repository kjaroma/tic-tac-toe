import useWebSocket, { ReadyState } from "react-use-websocket"
import { URLS } from "../../constants"
import { useEffect, useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import BoardCell from "./BoardCell"
import { generate2DArray } from "../../shared/array"
import GameId from "./GameId"

type BoardProps = {
    gameId: string
}

function Board({ gameId }: BoardProps) {
    const { token } = useAuth()

    const [board, setBoard] = useState(generate2DArray(3, " "))

    const url = `${URLS.joinGame}${gameId}?token=${token}`
    const { sendMessage, lastMessage, readyState } = useWebSocket(url, { share: false })
    const [messageHistory, setMessageHistory] = useState<string[]>([]);
    const [moveHistory, setMoveHistory] = useState<string[]>([]);

    useEffect(() => {
        if (lastMessage !== null) {
            const message = JSON.parse(lastMessage.data)
            switch (message.type) {
                case 'state_update':
                    setBoard(message.payload.state.board)
                    console.log(message.payload)
                    setMoveHistory(message.payload.state?.history ?? [])
                    break
                case 'info':
                    setMessageHistory((prev) => prev.concat(message.payload.message as unknown as string));
                    break
                default:
                    break;
            }
        }
 
    }, [lastMessage])

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

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
            <GameId gameId={gameId} />
            <div>{connectionStatus}</div>
            <div className="flex flex-col float-start">
                {board.map((row, rIdx) => <div key={rIdx} className="flex flex-row">
                    {row.map((_, cIdx) => <BoardCell key={`${cIdx}_${rIdx}`} onCellClick={handleCellClick(cIdx, rIdx)} cellValue={board[cIdx][rIdx]} />)}
                </div>)}
            </div>
            {moveHistory.map((m, i) => <div className="text-xs" key={i}>{JSON.stringify((m as any).data)}</div>)}
            {messageHistory.map((m, i) => <div className="text-xs" key={i}>{JSON.stringify((m as any).data)}</div>)}
        </div>
    )
}

export default Board