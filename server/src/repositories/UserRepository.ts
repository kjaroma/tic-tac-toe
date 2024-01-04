import { PrismaClient, User } from '@prisma/client';
import { BaseRepository } from './BaseRepository';

export class UserRepository extends BaseRepository<User> {
  constructor(private prisma: PrismaClient) {
    super(prisma.user);
  }
}
