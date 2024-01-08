import { FastifyRequest } from 'fastify';
import { ApiError } from '../../common/errors';
import { ErrorMessages, HttpStatus } from '../../common/constants';
import { FastifyJWT } from '@fastify/jwt';

export async function authHandler(req: FastifyRequest) {
  const token = req.cookies.access_token;
  if (!token) {
    throw new ApiError(
      ErrorMessages.Auth.AuthenticationFailed,
      HttpStatus.UNAUTHORIZED,
    );
  }
  const decoded = req.jwt.verify<FastifyJWT['user']>(token);
  req.user = decoded;
}
