import { GameError } from "../../common/errors";
import { Board, BoardSymbol, BoardValue, GameMove } from "../../shared/types";
import GameValidator from "../gameValidator/gameValidator.service";
import { IGame } from "../interfaces/IGame";

enum PlayerType {
    HOST = 'host',
    GUEST = 'guest',
}

type Player = {
    type: PlayerType;
    id: string;
    symbol: BoardSymbol;
};

export class Game implements IGame {
    public board: Board = []
    private validatorService: GameValidator
    private players: Player[] = [];
    private currentPlayerId?: string;
    private history: GameMove[] = [];

    constructor(private readonly gameId: string, private readonly boardSize: number) {
        this.createBoard(boardSize)
        this.validatorService = new GameValidator(boardSize);
    }

    private swapPlayers() {
        this.currentPlayerId = this.players.filter(
            (pl) => pl.id !== this.currentPlayerId,
        )[0].id;
    }
    
    private addMoveToHistory(column: number, row: number, playerId: string) {
        this.history.push({
            playerId,
            position: {
                column,
                row,
            },
        });
    }

    private getCurrentPlayerSymbol() {
        return this.players.filter(({id}) => id === this.currentPlayerId)[0].symbol
    }

    public createBoard(boardSize: number) {
        this.board = Array.from({ length: boardSize }, () =>
            Array.from({ length: boardSize }, () => null),
        );
    }

    public addPlayer(id: string) {
        if (this.players.length >= 2) {
            throw new GameError('Too many players', this.gameId)
        }
        if (this.players.length === 0) {
            this.players.push({
                type: PlayerType.HOST,
                id,
                symbol: BoardSymbol.X,
            });
        } else {
            this.players.push({
                type: PlayerType.GUEST,
                id,
                symbol: BoardSymbol.O
            });
            this.currentPlayerId = this.players[0].id;
        }
    }

    public makeMove(col: number, row: number) {
        if(this.players.length < 2){
            throw new GameError('Not enough players to start the game', this.gameId)
        }
        if (col > this.boardSize - 1 || row > this.boardSize - 1) {
            throw new GameError('Illegal move for given board size', this.gameId)
        }
        if (this.board[col][row] !== null) {
            throw new GameError('Illegal move, board cell in use', this.gameId)
        }
        this.board[col][row] = this.getCurrentPlayerSymbol();
        this.swapPlayers();
        this.addMoveToHistory(col, row, this.currentPlayerId as string);
    }

    public validateBoard(): number[] {
        return this.validatorService.validate(this.board, BoardSymbol.X);
    }

}