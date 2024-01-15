import { GameMessageType } from "../../shared/types";

export function getMoveMessage(col: number, row: number): string {
    return (JSON.stringify(
        {
            type: GameMessageType.MAKE_MOVE,
            payload: {
                col, row
            }
        })
    )
}

export function getJoinMessage(roomId: string): string {
    return (JSON.stringify(
        {
            type: GameMessageType.JOIN_ROOM,
            payload: { roomId }
        })
    )
}

export function getCreateMessage(): string {
    return (JSON.stringify(
        {
            type: GameMessageType.CREATE_ROOM,
        })
    )
}