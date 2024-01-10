import { Player } from "../../shared/types"

type ProfilesProps = {
    players: Player[],
    currentPlayerId: string,
}

function Profiles({ players, currentPlayerId }: ProfilesProps) {
    return (
        <div className="flex flex-row justify-around p-4">
            {players.map(pl => <Profile key={pl.id} player={pl} currentPlayerId={currentPlayerId} />)}
        </div>
    )
}

export default Profiles

type ProfileProps = {
    player: Player
    currentPlayerId: string
}

function Profile({ player, currentPlayerId }: ProfileProps) {

    const background = player.id === currentPlayerId ? "bg-gray-600" : "bg-gray-700"

    return (
    <div className={`flex flex-col w-32 overflow-hidden justify-center items-center py-6 px-4 border border-gray-600 rounded-lg ${background}`}>
        <div className="rounded-full bg-blue-600 w-16 h-16 flex flex-col items-center justify-center text-gray-300 text-3xl font-black mb-6">
            {player.name.split(' ').map(part => part.slice(0,1)).join("")}
        </div>
        <div className="text-gray-300">{player.name}</div>
    </div>
    )
}