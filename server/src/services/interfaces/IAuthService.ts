import { AuthenticatedResponse } from '../../modules/user/user.schema';
import { AuthTokenPayload } from '../../types';

export interface IAuthService {
  register(
    email: string,
    password: string,
    name: string,
  ): Promise<AuthenticatedResponse>;
  login(email: string, password: string): Promise<AuthenticatedResponse>;
  decodeAuthToken(token: string): AuthTokenPayload;
}
