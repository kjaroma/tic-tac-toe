import { FastifyReply, FastifyRequest } from "fastify";

export async function healthcheck(_: FastifyRequest, reply: FastifyReply) {
    reply.code(200).send({ status: 'OK' })
}