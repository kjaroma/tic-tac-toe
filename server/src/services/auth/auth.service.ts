import { UserService } from '../user/user.service';
import { IAuthService } from '../interfaces/IAuthService';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UserPayload } from '../../types';
import { JWT } from '@fastify/jwt';
import { ApiError } from '../../common/errors';
import { ErrorMessages, HttpStatus } from '../../common/constants';
import { AppConfigType } from '../../bootstrap/config/config.schema';

export class AuthService implements IAuthService {
  private SALT_ROUNDS = 10;

  constructor(
    private readonly userService: UserService,
    private readonly config: AppConfigType,
    private readonly jwt: JWT,
  ) {}

  async register(email: string, password: string, name: string): Promise<any> {
    const user = await this.userService.getByEmail(email);
    if (user) {
      throw new ApiError(
        ErrorMessages.Auth.RegistrationFailure,
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const hash = await bcrypt.hash(password, this.SALT_ROUNDS);
      const user = await this.userService.create({
        email,
        password: hash,
        name,
      });
      return this.createAuthToken(user);
    } catch (e) {
      throw new Error(ErrorMessages.Auth.GenericError);
    }
  }

  // TODO Type this
  async login(email: string, password: string): Promise<any> {
    const user = await this.userService.getByEmail(email);
    const isValidUser = user && (await bcrypt.compare(password, user.password));
    if (!user || !isValidUser) {
      throw new ApiError(
        ErrorMessages.Auth.LoginFailure,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.createAuthToken(user);
  }

  private createAuthToken(user: User): Record<string, unknown> {
    const { id, name, email } = user;
    const payload: UserPayload = {
      sub: id,
      iss: this.config.JWT_ISSUER,
      name: name ?? undefined,
      email,
    };
    return {
      accessToken: this.jwt.sign(payload),
    };
  }
}
