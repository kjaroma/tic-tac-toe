import { useState } from "react"
import { URLS } from "../../constants"
import Button from "../ui/Button"

type CreateGameProps = {
  onGameCreate: (gameId: string) => void
}

function CreateGame({ onGameCreate }: CreateGameProps) {

  const [boardSize, setBoardSize] = useState(3)

  const onBoardSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoardSize(+e.target.value)
  }

  const handleGameCreate = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(URLS.createGame, {
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Failed to fetch game details');
      }
      const data = await response.json();
      onGameCreate(data.gameId)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="mb-4 flex flex-col">
      <div className="flex flex-col mb-2">
        <label className='block text-gray-700 font-bold mb-2' htmlFor="size">Board size: {boardSize}</label>
        <input className="mb-2" type="range" min={3} max={9} step={2} id="size" defaultValue={boardSize} onChange={onBoardSizeChange} />
      </div>
      <Button onClick={handleGameCreate}>Create New Game</Button>
    </div>
  )
}

export default CreateGame;
