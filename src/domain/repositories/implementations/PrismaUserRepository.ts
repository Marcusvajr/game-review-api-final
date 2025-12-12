import { prisma } from "../../../infra/database/prismaClient";
import { IUserRepository } from "../IUserRepository";
import { User } from "@prisma/client";
export class PrismaUserRepository implements IUserRepository {
  create(data: { name: string; email: string; password: string; role?: string }): Promise<User> {
    return prisma.user.create({ data: { ...data, role: data.role ?? "USER" } });
  }
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }
  findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }
}
