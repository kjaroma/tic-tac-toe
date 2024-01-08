import { useRef, useState } from "react"
import { URLS } from "../../constants"
import IconCopy from "../icons/Copy";

function CreateGame() {

  const [gameId, setGameId] = useState("")
  const gameIdValue = useRef<HTMLInputElement>(null);

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
      setGameId(data.gameId)
    } catch (e) {
      console.error(e)
    }
  }

    const handleCopy = () => {
    if (gameIdValue.current) {
      gameIdValue.current.select();
      navigator.clipboard.writeText(gameIdValue.current.value)
      // TODO notify on success
    }
  };

  return (
    <div>
      <div>
        <input ref={gameIdValue} value={gameId} readOnly/>
        <button onClick={handleCopy}>
          <IconCopy width={"2em"} height={"2em"}/>
        </button>
      </div>
      <button onClick={handleGameCreate}>Crete Game</button>
    </div>
  )
}

export default CreateGame;
