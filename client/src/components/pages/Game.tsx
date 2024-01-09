import { useState } from "react";
import Board from "../game/Board";
import GameStarter from "../game/GameStarter";

const Game = () => {
  const [gameId, setGameId] = useState("")

  const onGameCreate = (gameId: string) => setGameId(gameId)

  return (
    <div className="p-12">
      {gameId
        ? <Board gameId={gameId} />
        : <GameStarter onGameCreate={onGameCreate} onGameJoin={onGameCreate} /> 
      }
    </div>
  );
};

export default Game
