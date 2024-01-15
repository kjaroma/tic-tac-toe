import useGame from "../../hooks/useGame";
import { LobbyTable } from "../lobby/LobbyTable";
import Button from "../ui/Button";

const Lobby = () => {

    const {rooms, onRoomCreate} = useGame()

    return (
        <main className="container mx-auto">
            <div className="flex justify-end py-4">
                <Button onClick={onRoomCreate}>Create New Game</Button>
            </div>
            <LobbyTable rooms={rooms} />
        </main>
    );
};

export default Lobby