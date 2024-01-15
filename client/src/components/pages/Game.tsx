import TicTacToeBoard from "../game/TicTacToeBoard";
import Lobby from "./Lobby";
import useGame from "../../hooks/useGame";
import GameProvider from "../../providers/GameProvider";

function Game() {
  return (
    <div className="flex flex-col items-center p-12">
      <GameProvider>
        <GamePanel />
      </GameProvider>
    </div>
  );
};

export default Game

function GamePanel() {
  const {roomId} = useGame()
  return (
    <>
      {
        roomId
          ? <TicTacToeBoard />
          : <Lobby />
      }
    </>
  )
}
