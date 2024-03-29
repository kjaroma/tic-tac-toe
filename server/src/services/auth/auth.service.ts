import { AuthenticatedResponse } from './../../modules/user/user.schema';
import { UserService } from '../user/user.service';
import { IAuthService } from '../interfaces/IAuthService';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { AuthTokenPayload } from '../../types';
import { FastifyJWT, JWT } from '@fastify/jwt';
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

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<AuthenticatedResponse> {
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

  async login(email: string, password: string): Promise<AuthenticatedResponse> {
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

  public decodeAuthToken(token: string): AuthTokenPayload {
    const decoded = this.jwt.decode<FastifyJWT['user']>(token);
    if (!decoded) {
      throw new ApiError(
        ErrorMessages.Auth.InvalidAuthToken,
        HttpStatus.UNAUTHORIZED,
      );
    }
    return decoded;
  }

  private createAuthToken(user: User): AuthenticatedResponse {
    const { id, name, email } = user;
    const payload: AuthTokenPayload = {
      sub: id,
      iss: this.config.JWT_ISSUER,
      name: name ?? undefined,
      email,
    };
    return {
      accessToken: this.jwt.sign(payload),
      userId: id,
      name,
    };
  }
}
