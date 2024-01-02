import { UserRepository } from '../../repositories/UserRepository';
import { AuthService } from '../../services/auth/authService';
import prisma from '../../utils/prisma';
import { authHandler } from '../../utils/server/authHandler';
import { UserService } from './../../services/user/userService';
import { FastifyInstance } from "fastify";

export function registerServices(app: FastifyInstance) {
    app.decorate('authenticate', authHandler)

    const userRepository = new UserRepository(prisma)
    const userService = new UserService(userRepository)
    app.decorate('userService', userService)

    const authService = new AuthService(userService, app.config, app.jwt)
    app.decorate('authService', authService)
}