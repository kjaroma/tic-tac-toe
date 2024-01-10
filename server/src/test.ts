import GameService from "./services/game/game.service";
import GameValidator from "./services/gameValidator/gameValidator.service";
const game = new GameService()
game.setMove(0,1, "x")
game.printBoard()


