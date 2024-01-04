import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiError } from '../../common/errors';
import { HttpStatus } from '../../common/constants';

export async function errorHandler(
  error: ApiError | Error,
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const statusCode =
    error instanceof ApiError
      ? error.statusCode
      : HttpStatus.INTERNAL_SERVER_ERROR;
  req.server.log.error({
    status: statusCode,
    message: error.message,
    stack: error.stack,
    ip: req.ip,
  });

  reply.status(statusCode).send({ message: error.message });
}
