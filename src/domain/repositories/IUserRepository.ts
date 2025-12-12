import { User } from "@prisma/client";
export interface IUserRepository {
  create(data: { name: string; email: string; password: string; role?: string }): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
}
