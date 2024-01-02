import { UserService } from './../user/userService';
import { IAuthService } from "../interfaces/IAuthService";
import bcrypt from 'bcrypt'
import { User } from '@prisma/client';
import { AppConfigType } from '../../utils/server/config/config.schema';
import { UserPayload } from '../../types';
import { JWT } from '@fastify/jwt';
import { log } from 'console';

export class AuthService implements IAuthService {

    private SALT_ROUNDS = 10

    constructor(
        private readonly userService: UserService,
        private readonly config: AppConfigType,
        private readonly jwt: JWT,
    ) { }
    async register(email: string, password: string, name: string): Promise<any> {
        const user = await this.userService.getByEmail(email)
        if (user) {
            // TODO Use proper error
            throw new Error('Email already taken') // Conflict?
        }

        try {
            const hash = await bcrypt.hash(password, this.SALT_ROUNDS)
            const user = await this.userService.create({ email, password: hash, name })
            return this.createAuthToken(user)
        } 
        catch (e) {
            // TODO Use proper error
            throw new Error('Something went wrong creating user') // 500
        }
    }

    async login(email: string, password: string): Promise<any> {
        const user = await this.userService.getByEmail(email);
        const isValidUser = user && (await bcrypt.compare(password, user.password))
        if(!user || !isValidUser) {
            throw new Error('Invalid email or password') // Unauthorised
        }

        return this.createAuthToken(user)
    }

    private createAuthToken(user: User): Record<string, unknown> {
        const { id, name, email } = user
        const payload: UserPayload = {
            sub: id,
            iss: this.config.JWT_ISSUER,
            name: name ?? undefined, email

        }
        return {
            accessToken: this.jwt.sign(payload)
        }
    }
}