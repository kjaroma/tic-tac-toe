import { useRef, useState } from "react";
import IconCopy from "../icons/Copy";

type GameIdProps = {
    gameId: string
}

const GameId = ({ gameId }: GameIdProps) => {

  const gameIdValue = useRef<HTMLInputElement>(null);
    const handleCopy = () => {
        if (gameIdValue.current) {
            gameIdValue.current.select();
            navigator.clipboard.writeText(gameIdValue.current.value)
            // TODO notify on success
        }
    };
    return (<div>
        <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            ref={gameIdValue} value={gameId} readOnly />
        <button onClick={handleCopy}>
            <IconCopy width={"2em"} height={"2em"} />
        </button>
    </div>
    )
}

export default GameId