import fastifyStatic from '@fastify/static';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import path from 'path';

export async function staticRoutes(app: FastifyInstance) {
  app.register(fastifyStatic, {
    root: path.join(process.cwd(), 'public'),
  });
  function handler(req: FastifyRequest, reply: FastifyReply) {
    reply.sendFile('index.html')
  }
  ['/login', '/register', '/game', '/history'].forEach(url => {
    app.route({
      method: ['GET'],
      url,
      handler,
    })
  })
}
