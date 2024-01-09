import { useState } from "react";

type GameJoinProps = {
    onGameJoin: (gameId: string) => void
}

const GameJoin = ({ onGameJoin }: GameJoinProps) => {

    const [gameId, setGameId] = useState("")
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        onGameJoin(gameId)
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGameId(e.target.value)
    }

    return (
    <div className="flex flex-row">
        <input className="shadow border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            value={gameId} onChange={handleChange} />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={handleClick}>Join Game</button>
    </div>
    )
}

export default GameJoin