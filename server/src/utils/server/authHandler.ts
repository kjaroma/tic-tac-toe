import { FastifyReply, FastifyRequest } from "fastify";
import { HttpStatus } from "../../common/constants";
import { FastifyJWT } from "@fastify/jwt";

export async function authHandler(req: FastifyRequest, reply: FastifyReply) {
    const token = req.cookies.access_token
    if (!token) {
        return reply.status(HttpStatus.UNAUTHORIZED).send({ message: 'Authentication required' })
    }
    const decoded = req.jwt.verify<FastifyJWT['user']>(token)
    req.user = decoded
}