import fastifyWebsocket, { SocketStream } from "@fastify/websocket";
import { FastifyInstance, FastifyRequest } from "fastify";
import { createGame, joinGame } from "./game.controller";
import { $ref } from "../../bootstrap/schemas/schemas.handler";
import GameService from "../../services/game/game.service";

export async function gameRoutes(app: FastifyInstance) {
    await app.register(fastifyWebsocket)

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
        console.log('Redirected to WS', req.url)
        const game = new GameService(3)
        conn.socket.on('open', () => {
            conn.socket.send('[SERVER] Connected to websocket\n')
        })
        conn.socket.on('connect', () => console.log("Connected"))
        conn.socket.on('message', (message) => {
            const payload = JSON.parse(message.toString())
            switch (payload.type) {
                case 'move':
                    game.setMove(payload.col, payload.row, payload.value === 0 ? "o" : "x")
                    break
                default:
                    break
            }
            game.printBoard()
            conn.socket.send(`[SERVER] Received the message: ${message.toString()}\n`)
        })
    })
}