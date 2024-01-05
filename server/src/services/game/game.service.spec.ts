import { GameRepository } from "../../repositories/GameRepository"
import GameService from "./game.service"

describe('gameService', () => {
    const gs = new GameService((()=>{}) as unknown as GameRepository, 3 )
    it('should create empty board', () => {
        gs.createBoard(3)
        gs.addPlayer("p1")
        gs.addPlayer("p2")
        gs.setMove(0, 1)
        gs.setMove(1, 0)
        gs.setMove(2, 2)
        gs.setMove(0, 2)
        gs.printBoard()
        gs.dump()
    })
})