import { GameValidation, GameValidationStatus, Player } from "../../shared/types"

type GameResultProps = {
    validation: GameValidation,
    players: Player[],
    currentPlayerId: string
}


function GameStatusComponent({ validation, players, currentPlayerId }: GameResultProps) {
    const { status, winnerId } = validation
    const winner = players.find(pl => pl.id === winnerId)
    const currentPlayer = players.find(pl => pl.id === currentPlayerId)
    return (
        <div className="bg-red-1500">
            {status === GameValidationStatus.NONE && currentPlayer ? <div className="text-gray-300 text-lg">Your turn {currentPlayer?.name ?? ""}!</div> : null}
            {status === GameValidationStatus.TIE ? <div className="text-gray-300 text-lg">Wow! It's a tie!</div> : null}
            {status === GameValidationStatus.WIN && winnerId && winner ?
                <div className="text-yellow-500 text-md">
                    Congratulations!<br />
                    Player {winner.name} won!
                </div> : null
            }
        </div>
    )
}

export default GameStatusComponent