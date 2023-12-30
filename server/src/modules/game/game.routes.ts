import fastifyWebsocket, { SocketStream } from "@fastify/websocket";
import { FastifyInstance } from "fastify";

export async function gameRoutes(app: FastifyInstance) {
    await app.register(fastifyWebsocket)
    app.get('/', {
        websocket: true,
        // TODO WS does not support cookies.
        preHandler: [app.authenticate]
    }, (conn: SocketStream) => {
        conn.socket.on('open', () => {
            conn.socket.send('[SERVER] Connected to websocket\n')
        })
        conn.socket.on('message', (message) => {
            conn.socket.send(`[SERVER] Received the message: ${message.toString()}\n`)
        })
    })
}
