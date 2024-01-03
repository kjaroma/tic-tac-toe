import fastifyWebsocket, { SocketStream } from "@fastify/websocket";
import { FastifyInstance, FastifyRequest } from "fastify";
import { createGame, joinGame } from "./game.controller";
import { $ref } from "../../bootstrap/schemas/schemas.handler";
import GameService from "../../services/game/game.service";
import { GameState } from "../../services/game/types";

export async function gameRoutes(app: FastifyInstance) {
    await app.register(fastifyWebsocket, {
        options: {
            clientTracking: true
            // TODO Add client verification
            // verifyClient option
        }
    })

    app.get('/create', {
        schema: {
            response: {
                201: $ref('createGameResponseSchema'),
            },
        },
        preHandler: [app.authenticate]
    },
        createGame)

    app.get('/:gameId', {
        websocket: true,
    }, async (conn: SocketStream, req: FastifyRequest) => {

        const { gameId } = req.params as { gameId: string }
        // TODO Find better way to do not update the same reference
        let game
        game = await app.gameService.findGameById(gameId)
        if (!game) {
            throw new Error('Game not found')
        }

        const broadCastMessage = (message: string) => {
            for (const client of server.clients) {
                client.send(message)
            }
        }

        const server = app.websocketServer
        if (server.clients.size > 2) {
            conn.socket.send(`Game full, try create new game`)
            conn.socket.close()
        }

            // TODO Get user Id from token
        const userId = "clqx0nmf200013snrvztckjlp"
        const userId2 = "clqx0ej4l00003snr03auyjdj"
        if (server.clients.size === 1 && game.hostId !== null && game.hostId !== userId) {
            game = await app.gameService.setGameHost(game, userId)
        } else {
            game = await app.gameService.setGameGuest(game, userId2)
        }

        if (server.clients.size === 2) {
            broadCastMessage("Second player joined, starting game")
            game = await app.gameService.setGameState(game, GameState.STARTED)
            conn.socket.on('message', (message) => {

                const payload = JSON.parse(message.toString())
                switch (payload.type) {
                    case 'move':
                        // game.setMove(payload.col, payload.row, payload.value === 0 ? "o" : "x")
                        break
                    default:
                        break
                }

                broadCastMessage(`Current board: ${JSON.stringify(null, null, 2)}\n`)
            })
        }
    })
}