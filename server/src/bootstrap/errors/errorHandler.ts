import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiError } from '../../common/errors';
import { HttpStatus } from '../../common/constants';
export async function errorHandler(error: ApiError | Error, req: FastifyRequest, reply: FastifyReply) {
    // TODO Handle errors properly
    req.server.log.error({
        data: JSON.stringify(error)
    })
    reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: error.message})
}