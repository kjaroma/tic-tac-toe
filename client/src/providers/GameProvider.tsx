import { PropsWithChildren, createContext, useEffect, useId, useState } from "react";
import { Board, GameMessage, GameMessageErrorPayload, GameMessageInfoPayload, GameMessageLobbyUpdate, GameMessageRoomCreatedPayload, GameMessageStateUpdatePayload, GameMessageType, GameState, GameValidationStatus } from "../shared/types";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Urls } from "../constants";
import useLogger from "../hooks/useLogger";
import { generate2DArray } from "../shared/array";
import { useAuth } from "../hooks/useAuth";
import { getCreateMessage, getJoinMessage, getMoveMessage } from "../common/helpers/message.helper";
import { Room } from "../components/lobby/LobbyTable";

type GameContextType = {
    gameState: GameState,
    roomId: string | undefined,
    readyState: ReadyState;
    rooms: Room[],
    onCellClick: (col: number, row: number) => (e: React.MouseEvent) => void
    onRoomJoin: (roomId: string) => (e: React.MouseEvent) => void
    onRoomCreate: (e: React.MouseEvent) => void
}

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

export const GameContext = createContext<GameContextType>({} as GameContextType)

const GameProvider = ({ children }: PropsWithChildren) => {

    const { error, warn } = useLogger()
    const { accessToken, userId } = useAuth().userAuthData ?? {} // Use token later
    const [gameState, setGameState] = useState<GameState>(initialGameState)
    const [roomId, setRoomId] = useState<string | undefined>()
    const [rooms, setRooms] = useState<Room[]>([])

    const url = `${Urls.PLAY_GAME}?token=${accessToken}`
    const { sendMessage, lastMessage, readyState } = useWebSocket(url, { share: false })

    // Incoming messages handler
    useEffect(() => {
        if (lastMessage !== null) {
            let message;
            try {
                message = JSON.parse(lastMessage.data)
            } catch (e) {
                error(JSON.stringify(e))
            }
            const { type, payload } = message as GameMessage
            switch (type as GameMessageType) {
                case GameMessageType.ROOM_CREATED:
                    setRoomId((payload as GameMessageRoomCreatedPayload).roomId)
                    break
                case GameMessageType.ROOM_JOINED:
                    setRoomId((payload as GameMessageRoomCreatedPayload).roomId)
                    break;
                case GameMessageType.ROOM_LEFT:
                    setRoomId(undefined)
                    break;
                case GameMessageType.LOBBY_UPDATE:
                    setRooms((payload as GameMessageLobbyUpdate).rooms)
                    break;
                case GameMessageType.STATE_UPDATE:
                    setGameState((payload as GameMessageStateUpdatePayload).gameState)
                    break;
                case GameMessageType.ERROR:
                    error((payload as GameMessageErrorPayload).message)
                    break;
                case GameMessageType.INFO:
                    error((payload as GameMessageInfoPayload).message)
                    break;
                default:
                    warn(`Unknown message type: ${message.type}`)
                    break;
            }
        }

    }, [lastMessage, error, warn])


    const onMakeMove = (col: number, row: number) => (e: React.MouseEvent) => {
        e.preventDefault()
        // Keep the right turn
        if(gameState.currentPlayerId === userId) {
            sendMessage(getMoveMessage(col, row))
        }
    }

    const onRoomJoin = (roomId: string) => (e: React.MouseEvent) => {
        e.preventDefault()
        sendMessage(getJoinMessage(roomId))
    }

    const onRoomCreate = (e: React.MouseEvent) => {
        e.preventDefault()
        sendMessage(getCreateMessage())
    }

    const value = {
        gameState,
        roomId,
        readyState,
        rooms,
        onCellClick: onMakeMove,
        onRoomCreate,
        onRoomJoin,
    }

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    )

};

export default GameProvider