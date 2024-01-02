import { FastifyReply, FastifyRequest } from "fastify";
import { ErrorMessages, HttpStatus } from "../../common/constants";
import { FastifyJWT } from "@fastify/jwt";
import { ApiError } from "../../common/errors";

export async function authHandler(req: FastifyRequest, reply: FastifyReply) {
    const token = req.cookies.access_token
    if (!token) {
        throw new ApiError(ErrorMessages.Auth.AuthenticationFailed, HttpStatus.UNAUTHORIZED)
    }
    const decoded = req.jwt.verify<FastifyJWT['user']>(token)
    req.user = decoded
}