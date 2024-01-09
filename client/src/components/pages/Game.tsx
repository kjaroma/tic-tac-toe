import Board from "../game/Board";
import CreateGame from "../game/CreateGame";

const Game = () => {
    return (
      <main style={{ padding: '1rem 0' }}>
        <CreateGame/>
        <Board gameId={"clr590yho0000xeuqv9c8im8a"}/>
      </main>
    );
  };

  export default Game
