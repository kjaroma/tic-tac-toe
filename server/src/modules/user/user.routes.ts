import { FastifyInstance } from 'fastify';
import { createUser, loginUser, logoutUser } from './user.controller';
import { $ref } from '../../bootstrap/schemas/schemas.handler';

export async function userRoutes(app: FastifyInstance) {
  app.post(
    '/register',
    {
      schema: {
        body: $ref('createUserSchema'),
        response: {
          201: $ref('authenticatedResponseSchema'),
        },
      },
    },
    createUser,
  );

  app.post(
    '/login',
    {
      schema: {
        body: $ref('loginSchema'),
        response: {
          201: $ref('authenticatedResponseSchema'),
        },
      },
    },
    loginUser,
  );

  app.delete('/logout', { preHandler: [app.authenticate] }, logoutUser);
}
