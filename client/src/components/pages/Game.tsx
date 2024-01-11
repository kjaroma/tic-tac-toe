import { useCallback, useState } from "react";
import GameStarter from "../game/GameStarter";
import TicTacToeBoard from "../game/TicTacToeBoard";

const Game = () => {
  const [gameId, setGameId] = useState("")

  const onGameCreate = useCallback((gameId: string) => setGameId(gameId), [])

  return (
    <div className="flex flex-col items-center p-12">
      {gameId
        ? <TicTacToeBoard gameId={gameId} />
        : <GameStarter onGameCreate={onGameCreate} onGameJoin={onGameCreate} /> 
      }
    </div>
  );
};

export default Game
