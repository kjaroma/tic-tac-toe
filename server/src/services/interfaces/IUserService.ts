import { User } from "@prisma/client";
import { CreateUserInput } from "../../modules/user/user.schema";

export interface IUserService {
    getByEmail(email: string): Promise<User | null>
    create(user: CreateUserInput): Promise<User>
}