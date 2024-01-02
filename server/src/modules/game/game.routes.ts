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
        preHandler: [app.authenticate]
    },
        createGame)

    app.post('/join', {
        schema: {
            body: $ref('joinGameSchema')
        },
        preHandler: [app.authenticate]
    },
        joinGame)

    app.get('/:gameId', {
        websocket: true,
    }, (conn: SocketStream, req: FastifyRequest) => {
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
        conn.socket.on('message', (message) => {
            const payload = JSON.parse(message.toString())
            switch (payload.type) {
                case 'move':
                    // game.setMove(payload.col, payload.row, payload.value === 0 ? "o" : "x")
                    break
                default:
                    break
            }
            // game.printBoard()
            broadCastMessage(`[SERVER] Received the message: ${message.toString()}\n`)
        })
    })
}