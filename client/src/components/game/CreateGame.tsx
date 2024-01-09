import { URLS } from "../../constants"

type CreateGameProps = {
  onGameCreate: (gameId: string) => void
}

function CreateGame({ onGameCreate }: CreateGameProps) {

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
    <div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={handleGameCreate}>Crete Game</button>
    </div>
  )
}

export default CreateGame;
