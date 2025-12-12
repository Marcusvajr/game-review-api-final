import { RefreshToken } from "@prisma/client";
export interface IRefreshTokenRepository {
  create(data: { token: string; userId: number; expiresAt: Date }): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  deleteByToken(token: string): Promise<void>;
}
