import { prisma } from "../../../infra/database/prismaClient";
import { IRefreshTokenRepository } from "../IRefreshTokenRepository";
import { RefreshToken } from "@prisma/client";
export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  create(data: { token: string; userId: number; expiresAt: Date }): Promise<RefreshToken> {
    return prisma.refreshToken.create({ data });
  }
  findByToken(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({ where: { token } });
  }
  async deleteByToken(token: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { token } });
  }
}
