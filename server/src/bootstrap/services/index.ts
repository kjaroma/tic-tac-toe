import { UserRepository } from '../../repositories/UserRepository';
import prisma from '../../utils/prisma';
import { UserService } from './../../services/user/userService';
import { FastifyInstance } from "fastify";

export function registerServices(app: FastifyInstance) {
    const userRepository = new UserRepository(prisma)
    const userService = new UserService(userRepository)
    app.decorate('userService', userService)
}