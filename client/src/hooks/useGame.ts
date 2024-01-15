import React from "react";
import { GameContext } from "../providers/GameProvider";

function useGame() {
    return React.useContext(GameContext)
}

export default useGame;