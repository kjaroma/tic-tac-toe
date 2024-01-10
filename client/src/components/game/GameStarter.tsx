import CreateGame from "./CreateGame"
import GameJoin from "./JoinGame"

type GameStarterProps = {
  onGameCreate: (gameId: string) => void
  onGameJoin: (gameId: string) => void
}

const GameStarter = ({ onGameCreate, onGameJoin }: GameStarterProps) => {
  return (
    <div className="w-full mt-6">
      <div className="bg-white shadow-md rounded-lg px-8 pt-8 pb-8 mb-4">
        <div className="flex flex-col">
          <div className="text-3xl text-gray-700 font-extrabold mb-6">
            Let's play!
          </div>
          <CreateGame onGameCreate={onGameCreate} />
          <div className="text-2xl text-gray-700 font-extrabold mb-4">
            or
          </div>
          <GameJoin onGameJoin={onGameJoin} />
        </div>
      </div>
    </div>

  )
}

export default GameStarter