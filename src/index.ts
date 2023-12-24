import Game from "./game/Game";

const game = new Game(3)

game.printBoard()
game.setMove(0, 0, 'x')
game.setMove(1, 1, 'x')
game.setMove(1, 1, 'o')
game.setMove(3, 3, 'o')
game.printBoard()
