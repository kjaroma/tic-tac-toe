import { FastifyReply, FastifyRequest } from 'fastify';
import { HttpStatus } from '../../common/constants';

export async function createGame(req: FastifyRequest, reply: FastifyReply) {
  const { id } = await req.server.gameService.createGame();
  reply.status(HttpStatus.CREATED).send({ gameId: id });
}
