import { useRef } from "react";
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
            alert("Game Id copied")
        }
    };
    return (
    <div className="flex flex-row items-center justify-center bg-gray-700 p-1 rounded-lg">
        <input className="focus:outline-none border-none bg-gray-700 border border-gray-700 text-gray-900 rounded-lg focus:ring-gray-700 focus:border-gray-700 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-700 dark:placeholder-gray-700 dark:text-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-sm flex-grow" ref={gameIdValue} value={gameId} readOnly />
        <button onClick={handleCopy} className="pr-2">
            <IconCopy width={"1.5em"} height={"1.5em"} fill="#d1d5db" />
        </button>
    </div>
    )
}

export default GameId