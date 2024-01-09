import { useState } from "react";
import GameStarter from "../game/GameStarter";
import TicTacToeBoard from "../game/TicTacToeBoard";

const Game = () => {
  const [gameId, setGameId] = useState("")

  const onGameCreate = (gameId: string) => setGameId(gameId)

  return (
    <div className="p-12">
      {gameId
        ? <TicTacToeBoard gameId={gameId} />
        : <GameStarter onGameCreate={onGameCreate} onGameJoin={onGameCreate} /> 
      }
    </div>
  );
};

export default Game
