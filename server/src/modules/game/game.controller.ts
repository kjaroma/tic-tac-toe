import { FastifyReply, FastifyRequest } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { HttpStatus } from '../../common/constants';

export async function createGame(req: FastifyRequest, reply:FastifyReply) {
    const {id} = await req.server.gameService.createGame()
    reply.status(HttpStatus.CREATED).send({gameId: id})
}

export async function joinGame() {
    console.log('Game joined')
}