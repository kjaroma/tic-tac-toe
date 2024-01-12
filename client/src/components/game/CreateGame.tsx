import { useState } from "react"
import Button from "../ui/Button"
import useCreateGame from "../../hooks/useCreateGame"

type CreateGameProps = {
  onGameCreate: (gameId: string) => void
}

function CreateGame({ onGameCreate }: CreateGameProps) {

  const [boardSize, setBoardSize] = useState(3)

  const onBoardSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoardSize(+e.target.value)
  }

  const {createGame} = useCreateGame(onGameCreate)

  return (
    <div className="mb-4 flex flex-col">
      <div className="flex flex-col mb-2">
        <label className='block text-gray-700 font-bold mb-2' htmlFor="size">Board size: {boardSize}</label>
        <input className="mb-2" type="range" min={3} max={9} step={2} id="size" defaultValue={boardSize} onChange={onBoardSizeChange} />
      </div>
      <Button onClick={createGame}>Create New Game</Button>
    </div>
  )
}

export default CreateGame;
