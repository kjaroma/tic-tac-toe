import fastifyWebsocket, { SocketStream } from "@fastify/websocket";
import { FastifyInstance, FastifyRequest } from "fastify";
import { createGame, joinGame } from "./game.controller";
import { $ref } from "../../utils/server/loadSchemas";

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
        conn.socket.on('open', () => {
            conn.socket.send('[SERVER] Connected to websocket\n')
        })
        conn.socket.on('message', (message) => {
            conn.socket.send(`[SERVER] Received the message: ${message.toString()}\n`)
        })
    })
}