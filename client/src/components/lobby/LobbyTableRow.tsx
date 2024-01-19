import useGame from "../../hooks/useGame"
import Button from "../ui/Button"
import { Room } from "./LobbyTable"

type LobbyTableRowProps = {
  room: Room
}

function LobbyTableRow({ room }: LobbyTableRowProps) {

  const { onRoomJoin } = useGame()

  return (
    <tr key={room.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <td className="px-6 py-3">{room.id}</td>
      <td className="px-6 py-3 text-center">{room.players} of 2</td>
      <td className="text-center">
        <Button onClick={onRoomJoin(room.id)} disabled={room.players === 2}>Join</Button>
      </td>
    </tr>
  )
}

export default LobbyTableRow
