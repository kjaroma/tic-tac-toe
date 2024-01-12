import useCreateGame from "../../hooks/useCreateGame";
import { GameValidation, GameValidationStatus } from "../../shared/types";
import Button from "../ui/Button";

type RematchOverlayProps = {
    validation: GameValidation
    onGameCreate: (gameId: string) => void
}

function RematchOverlay({ validation, onGameCreate }: RematchOverlayProps) {

    const isGameEnded = validation.status !== GameValidationStatus.NONE
    const { createGame } = useCreateGame(onGameCreate)

    return (
        isGameEnded ?
            <>
                <div className="bg-gray-900 opacity-60 absolute top-0 left-0 bottom-0 right-0 rounded-lg" />
                <div className="flex flex-col items-center justify-center absolute top-0 left-0 bottom-0 right-0">
                    <Button onClick={createGame}>Play another game?</Button>
                </div>
            </>
            : null
    )
}

export default RematchOverlay