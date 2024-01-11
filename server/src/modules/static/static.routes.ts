import fastifyStatic from '@fastify/static';
import { FastifyInstance } from 'fastify';
import path from 'path';

export async function staticRoutes(app: FastifyInstance) {
  app.register(fastifyStatic, {
    root: path.join(process.cwd(), 'public'),
  });
}
