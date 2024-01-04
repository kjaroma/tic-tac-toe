import { UserRepository } from '../../repositories/UserRepository';
import { User } from '@prisma/client';
import { IUserService } from '../interfaces/IUserService';
import { CreateUserInput } from '../../modules/user/user.schema';

export class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}

  getByEmail(email: string): Promise<User | null> {
    return this.userRepository.findUnique({ email });
  }
  create(user: CreateUserInput): Promise<User> {
    return this.userRepository.create(user as User);
  }
}
