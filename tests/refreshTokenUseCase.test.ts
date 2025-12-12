import { RefreshTokenUseCase } from "../src/domain/usecases/auth/RefreshTokenUseCase";
import { IRefreshTokenRepository } from "../src/domain/repositories/IRefreshTokenRepository";
import { IUserRepository } from "../src/domain/repositories/IUserRepository";
import jwt from "jsonwebtoken";
import { AuthenticationError } from "../src/presentation/errors/AppError";
import { env } from "../src/config/env";

class InMemoryRefreshTokenRepository implements IRefreshTokenRepository {
  public tokens: any[] = [];
  async create(data: { token: string; userId: number; expiresAt: Date }) {
    const item = { id: this.tokens.length + 1, ...data };
    this.tokens.push(item);
    return item as any;
  }
  async findByToken(token: string) {
    return (this.tokens.find(t => t.token === token) as any) ?? null;
  }
  async deleteByToken(token: string) {
    this.tokens = this.tokens.filter(t => t.token !== token);
  }
}

class InMemoryUserRepository implements IUserRepository {
  private users = [{ id: 1, email: "user@test.com", name: "User", password: "hashed", role: "USER" }];
  async create(data: { name: string; email: string; password: string; role?: string }) {
    const user = { ...data, id: this.users.length + 1, role: data.role ?? "USER" };
    this.users.push(user);
    return user as any;
  }
  async findByEmail(email: string) {
    return (this.users.find(u => u.email === email) as any) ?? null;
  }
  async findById(id: number) {
    return (this.users.find(u => u.id === id) as any) ?? null;
  }
}

describe("RefreshTokenUseCase", () => {
  it("should issue new access token for a valid refresh token", async () => {
    const refreshRepo = new InMemoryRefreshTokenRepository();
    const userRepo = new InMemoryUserRepository();
    const usecase = new RefreshTokenUseCase(refreshRepo, userRepo);

    const refreshToken = jwt.sign({ sub: 1, role: "USER" }, env.jwtRefreshSecret, { expiresIn: "7d" });
    const decoded: any = jwt.decode(refreshToken);
    await refreshRepo.create({ token: refreshToken, userId: 1, expiresAt: new Date(decoded.exp * 1000) });

    const result = await usecase.execute({ token: refreshToken });

    expect(result.accessToken).toBeTruthy();
    expect(result.user.id).toBe(1);
  });

  it("should remove expired refresh token and throw", async () => {
    const refreshRepo = new InMemoryRefreshTokenRepository();
    const userRepo = new InMemoryUserRepository();
    const usecase = new RefreshTokenUseCase(refreshRepo, userRepo);

    const expiredToken = "expired-token";
    await refreshRepo.create({ token: expiredToken, userId: 1, expiresAt: new Date(Date.now() - 1000) });

    await expect(usecase.execute({ token: expiredToken })).rejects.toBeInstanceOf(AuthenticationError);
    expect(refreshRepo.tokens.find(t => t.token === expiredToken)).toBeUndefined();
  });
});
