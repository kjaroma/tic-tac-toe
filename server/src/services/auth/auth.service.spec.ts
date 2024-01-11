import bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { ApiError } from '../../common/errors';
import { ErrorMessages, HttpStatus } from '../../common/constants';
import { AuthService } from './auth.service';
import { AppConfigType } from '../../bootstrap/config/config.schema';
import { JWT } from '@fastify/jwt';
import { UserRepository } from '../../repositories/UserRepository';

jest.mock('bcrypt');
jest.mock('@fastify/jwt');

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService({} as unknown as UserRepository);
    authService = new AuthService(
      userService,
      { JWT_ISSUER: 'testIssuer' } as AppConfigType,
      { sign: jest.fn(), decode: jest.fn() } as unknown as JWT,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    xit('should register a new user and return an AuthenticatedResponse', async () => {
      const mockCreate = jest
        .spyOn(userService, 'create')
        .mockResolvedValueOnce({
          id: 'ID',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'hashedPassword',
        });

      const result = await authService.register(
        'john@example.com',
        'password',
        'John Doe',
      );

      expect(mockCreate).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('userId', 1);
      expect(result).toHaveProperty('name', 'John Doe');
    });

    it('should throw ApiError with UNAUTHORIZED status when user already exists', async () => {
      jest.spyOn(userService, 'getByEmail').mockResolvedValueOnce({
        id: 'ID',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
      });

      await expect(
        authService.register('john@example.com', 'password', 'John Doe'),
      ).rejects.toThrow(
        new ApiError(
          ErrorMessages.Auth.RegistrationFailure,
          HttpStatus.UNAUTHORIZED,
        ),
      );
    });

    it('should throw an error for other exceptions during registration', async () => {
      jest.spyOn(userService, 'getByEmail').mockResolvedValueOnce(null);
      jest
        .spyOn(userService, 'create')
        .mockRejectedValueOnce(new Error('Test error'));

      await expect(
        authService.register('john@example.com', 'password', 'John Doe'),
      ).rejects.toThrow(new Error(ErrorMessages.Auth.GenericError));
    });
  });

  describe('login', () => {
    xit('should login and return an AuthenticatedResponse', async () => {
      const mockGetByEmail = jest
        .spyOn(userService, 'getByEmail')
        .mockResolvedValueOnce({
          id: 'ID',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'hashedPassword',
        });

      const result = await authService.login('john@example.com', 'password');

      expect(mockGetByEmail).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('userId', 1);
      expect(result).toHaveProperty('name', 'John Doe');
    });

    it('should throw ApiError with UNAUTHORIZED status when user does not exist', async () => {
      jest.spyOn(userService, 'getByEmail').mockResolvedValueOnce(null);

      await expect(
        authService.login('john@example.com', 'password'),
      ).rejects.toThrow(
        new ApiError(ErrorMessages.Auth.LoginFailure, HttpStatus.UNAUTHORIZED),
      );
    });

    it('should throw ApiError with UNAUTHORIZED status when password is invalid', async () => {
      jest.spyOn(userService, 'getByEmail').mockResolvedValueOnce({
        id: 'ID',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(
        authService.login('john@example.com', 'invalidPassword'),
      ).rejects.toThrow(
        new ApiError(ErrorMessages.Auth.LoginFailure, HttpStatus.UNAUTHORIZED),
      );
    });
  });

  describe('decodeAuthToken', () => {
    it('should decode an auth token and return the payload', () => {
      const mockDecode = (
        authService['jwt'].decode as jest.Mock
      ).mockReturnValueOnce({
        id: 'ID',
        iss: 'testIssuer',
        name: 'John Doe',
        email: 'john@example.com',
      });

      const result = authService.decodeAuthToken('mockToken');

      expect(mockDecode).toHaveBeenCalledWith('mockToken');
      expect(result).toEqual({
        id: 'ID',
        iss: 'testIssuer',
        name: 'John Doe',
        email: 'john@example.com',
      });
    });

    it('should throw ApiError with UNAUTHORIZED status when decoding fails', () => {
      (authService['jwt'].decode as jest.Mock).mockReturnValueOnce(null);

      expect(() => authService.decodeAuthToken('mockToken')).toThrow(
        new ApiError(
          ErrorMessages.Auth.InvalidAuthToken,
          HttpStatus.UNAUTHORIZED,
        ),
      );
    });
  });
});
