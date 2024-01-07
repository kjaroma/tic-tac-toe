import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserInput, LoginUserInput } from './user.schema';
import { HttpStatus as HttpStatus } from '../../common/constants';

export async function createUser(
  req: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply,
) {
  const { email, password, name } = req.body;
  // TODO Validate input

  const payload = await req.server.authService.register(email, password, name);

  reply.setCookie('access_token', payload.accessToken, {
    path: '/',
    httpOnly: true,
    secure: true,
  });
  reply.status(HttpStatus.CREATED).send(payload);
}

export async function loginUser(
  req: FastifyRequest<{
    Body: LoginUserInput;
  }>,
  reply: FastifyReply,
) {
  const { email, password } = req.body;
  // TODO validate input

  const payload = await req.server.authService.login(email, password);

  reply.setCookie('access_token', payload.accessToken, {
    path: '/',
    httpOnly: true,
    secure: true,
  });

  return payload;
}

export async function logoutUser(req: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie('access_token');

  return reply.status(HttpStatus.OK).send({ message: 'Logout successful' });
}
