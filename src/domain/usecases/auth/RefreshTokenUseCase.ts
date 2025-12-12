import { IRefreshTokenRepository } from "../../repositories/IRefreshTokenRepository";
import { IUserRepository } from "../../repositories/IUserRepository";
import jwt from "jsonwebtoken";
import { env } from "../../../config/env";
import { AuthenticationError } from "../../../presentation/errors/AppError";
interface RefreshTokenRequest { token: string; }
export class RefreshTokenUseCase {
  constructor(
    private refreshTokenRepository: IRefreshTokenRepository,
    private userRepository: IUserRepository
  ) {}
  async execute({ token }: RefreshTokenRequest) {
    const stored = await this.refreshTokenRepository.findByToken(token);
    if (!stored) throw new AuthenticationError("Refresh token inválido.");
    if (stored.expiresAt < new Date()) {
      await this.refreshTokenRepository.deleteByToken(token);
      throw new AuthenticationError("Refresh token expirado.");
    }
    const decoded: any = jwt.verify(token, env.jwtRefreshSecret);
    const user = await this.userRepository.findById(decoded.sub);
    if (!user) throw new AuthenticationError("Usuário não encontrado.");
    const payload: jwt.JwtPayload = { sub: String(user.id), role: user.role };
    const options: jwt.SignOptions = { expiresIn: env.accessTokenExpiresIn as any };
    const newAccessToken = jwt.sign(payload, env.jwtAccessSecret, options);
    return { accessToken: newAccessToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  }
}
