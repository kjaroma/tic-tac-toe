import fastifyStatic from '@fastify/static'
import { FastifyInstance } from 'fastify'
import path from 'path'


export async function staticRoutes(app: FastifyInstance) {
  app.register(fastifyStatic, {
    root: path.join(__dirname, 'public')
  })
  app.get('/', function(_, reply) {
    reply.sendFile('index.html')
  })
}
