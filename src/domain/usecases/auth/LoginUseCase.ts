import { IUserRepository } from "../../repositories/IUserRepository";
import { IRefreshTokenRepository } from "../../repositories/IRefreshTokenRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../../config/env";
import { AuthenticationError } from "../../../presentation/errors/AppError";
interface LoginRequest { email: string; password: string; }
export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository
  ) {}
  async execute({ email, password }: LoginRequest) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new AuthenticationError("Credenciais inválidas.");
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new AuthenticationError("Credenciais inválidas.");
    const accessOptions: jwt.SignOptions = { expiresIn: env.accessTokenExpiresIn as jwt.SignOptions["expiresIn"] };
    const accessToken = jwt.sign(
      { sub: String(user.id), role: user.role },
      env.jwtAccessSecret,
      accessOptions
    );
    const refreshOptions: jwt.SignOptions = { expiresIn: env.refreshTokenExpiresIn as jwt.SignOptions["expiresIn"] };
    const refreshToken = jwt.sign(
      { sub: user.id, role: user.role },
      env.jwtRefreshSecret,
      refreshOptions
    );
    const decoded: any = jwt.decode(refreshToken);
    const expiresAt = new Date(decoded.exp * 1000);
    await this.refreshTokenRepository.create({ token: refreshToken, userId: user.id, expiresAt });
    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    };
  }
}
