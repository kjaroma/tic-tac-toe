import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

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
        <div className="flex flex-col">
            <Input
                value={gameId} onChange={handleChange} placeholder="Paste game Id" />
            <Button onClick={handleClick}>Join Existing Game</Button>
        </div>
    )
}

export default GameJoin