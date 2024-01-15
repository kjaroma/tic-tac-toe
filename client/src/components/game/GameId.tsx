

type GameIdProps = {
  gameId: string
}

const GameId = ({ gameId }: GameIdProps) => {

  return (
    <div className="flex flex-row items-center justify-center bg-gray-700 p-1 rounded-lg">
      <input className="text-center focus:outline-none border-none bg-gray-700 border border-gray-700 text-gray-900 rounded-lg focus:ring-gray-700 focus:border-gray-700 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-700 dark:placeholder-gray-700 dark:text-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-sm flex-grow" value={gameId} readOnly />
    </div>
  )
}

export default GameId
