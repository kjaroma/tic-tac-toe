import useWebSocket, { ReadyState } from "react-use-websocket"
import { URLS } from "../../constants"
import { useEffect, useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import BoardCell from "./BoardCell"
import GameId from "./GameId"
import useGame from "../../hooks/useGame"

type BoardProps = {
    gameId: string
}

function TicTacToeBoard({ gameId }: BoardProps) {
    const { accessToken, userId, name } = useAuth().userAuthData ?? {}
    const { currentPlayerId, board, history, log, setGameState, storeInfoMessage } = useGame()

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
                    storeInfoMessage(message.payload.message as unknown as string)
                    break
                default:
                    break;
            }
        }

    }, [lastMessage, setGameState, storeInfoMessage])

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
            <p>{name}{userId}</p>
            {currentPlayerId === userId ? <h2>Tour turn</h2> : <h4>Not you</h4>}
            <GameId gameId={gameId} />
            <div>{connectionStatus}</div>
            <div className="flex flex-col float-start">
                {board.map((row, rIdx) => <div key={rIdx} className="flex flex-row">
                    {row.map((_, cIdx) => <BoardCell key={`${cIdx}_${rIdx}`} onCellClick={handleCellClick(cIdx, rIdx)} cellValue={board[cIdx][rIdx] ?? " "} />)}
                </div>)}
            </div>
            {history.map((m, i) => <div className="text-xs" key={i}>{JSON.stringify((m as any).data)}</div>)}
            {log.map((m, i) => <div className="text-xs" key={i}>{JSON.stringify((m as any).data)}</div>)}
            {JSON.stringify(currentPlayerId)}
        </div>
    )
}

export default TicTacToeBoard