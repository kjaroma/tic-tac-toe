import LobbyTableRow from "./LobbyTableRow"

export type Room = {
    id: string,
    players: number
}

type LobbyTableProps = {
    rooms: Room[]
}

export function LobbyTable({ rooms }: LobbyTableProps) {
    return (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th className="px-6 py-3">Room ID</th>
                    <th className="px-6 py-3">Players</th>
                    <th className="px-6 py-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                {rooms.map(room => <LobbyTableRow key={room.id} room={room} />)}
            </tbody>
        </table >
    )
}