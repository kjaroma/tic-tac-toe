import useWebSocket, { ReadyState } from "react-use-websocket"
import { URLS } from "../../constants"
import { useEffect, useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import BoardCell from "./BoardCell"

type BoardProps = {
    gameId: string
}

function Board({ gameId }: BoardProps) {
    const { token } = useAuth()

    const generate2DArray = (size: number, defaultValue: " "): string[][] =>
        Array.from({ length: size }, () =>
            Array.from({ length: size }, () => defaultValue),
        );

    const [board, setBoard] = useState(generate2DArray(3, " "))


    const url = `${URLS.joinGame}${gameId}?token=${token}`
    const { sendMessage, lastMessage, readyState } = useWebSocket(url, { share: false })
    const [messageHistory, setMessageHistory] = useState<string[]>([]);


    useEffect(() => {
        if (lastMessage !== null) {
            const message = JSON.parse(lastMessage.data)
            switch (message.type) {
                case 'state_update':
                    setBoard(message.payload.state.board)
                     console.log(message.payload)
                    break
                default:
                    break;
            }
            setMessageHistory((prev) => prev.concat(lastMessage as unknown as string));
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
            console.log("Clicked", col, row)
        }
    }


    // TODO use gameState

    // )
    return (
        <>
            <div>{connectionStatus}</div>
            <div>
                {board.map((row, rIdx) => <div key={rIdx}>{row.map((_, cIdx) => <BoardCell key={`${cIdx}_${rIdx}`} onCellClick={handleCellClick(cIdx, rIdx)} cellValue={board[cIdx][rIdx]} />)}</div>)}
            </div>
            <>
                {messageHistory.map((m, i) => <div key={i}>{JSON.stringify((m as any).data)}</div>)}
            </>
        </>
    )
}

export default Board