import { UserRepository } from '../../repositories/UserRepository';
import { AuthService } from '../../services/auth/auth.service';
import prisma from '../../utils/prisma';
import { authHandler } from '../auth/auth.handler';
import { UserService } from '../../services/user/user.service';
import { FastifyInstance } from "fastify";

export function registerServices(app: FastifyInstance) {
    app.decorate('authenticate', authHandler)

    const userRepository = new UserRepository(prisma)
    const userService = new UserService(userRepository)
    app.decorate('userService', userService)

    const authService = new AuthService(userService, app.config, app.jwt)
    app.decorate('authService', authService)
}