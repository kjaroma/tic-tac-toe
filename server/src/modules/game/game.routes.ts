import fastifyWebsocket, { SocketStream } from "@fastify/websocket";
import { FastifyInstance, FastifyRequest } from "fastify";
import { createGame, joinGame } from "./game.controller";
import { $ref } from "../../bootstrap/schemas/schemas.handler";
import GameService from "../../services/game/game.service";

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
        if (server.clients.size === 2) {
            broadCastMessage("Second player joined, starting game")
        }
        const game = await app.gameService.createGame()
        console.log(game)
        conn.socket.on('message', (message) => {
            // TODO Do not handle messages when less than 2 users are connected
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
    })
}