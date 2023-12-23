import fastifyWebsocket, { SocketStream } from "@fastify/websocket";
import { FastifyInstance, FastifyRequest } from "fastify";

export async function gameRoutes(app: FastifyInstance) {
    await app.register(fastifyWebsocket)
    app.get('/', {websocket: true}, (conn: SocketStream, req: FastifyRequest) => {
        conn.socket.on('open', () => {
            conn.socket.send('[SERVER] Connected to websocket\n')
        })
        conn.socket.on('message', (message) => {
            conn.socket.send(`[SERVER] Received the message: ${message.toString()}\n`)
        })
    })
}
