import CreateGame from "./CreateGame"
import GameJoin from "./JoinGame"

type GameStarterProps = {
  onGameCreate: (gameId: string) => void
  onGameJoin: (gameId: string) => void
}

const GameStarter = ({ onGameCreate, onGameJoin }: GameStarterProps) => {
  return <>
    <CreateGame onGameCreate={onGameCreate} />
    <h2>Spacer</h2>
    <GameJoin onGameJoin={onGameJoin} />
  </>
}

export default GameStarter