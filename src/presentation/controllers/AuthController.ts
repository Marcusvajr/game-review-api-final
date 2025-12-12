import { Request, Response } from "express";
import { RegisterUserUseCase } from "../../domain/usecases/auth/RegisterUserUseCase";
import { LoginUseCase } from "../../domain/usecases/auth/LoginUseCase";
import { RefreshTokenUseCase } from "../../domain/usecases/auth/RefreshTokenUseCase";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IRefreshTokenRepository } from "../../domain/repositories/IRefreshTokenRepository";
export class AuthController {
  constructor(
    private userRepo: IUserRepository,
    private refreshTokenRepo: IRefreshTokenRepository
  ) {}
  async register(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const usecase = new RegisterUserUseCase(this.userRepo);
    const user = await usecase.execute({ name, email, password });
    return res.status(201).json(user);
  }
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const usecase = new LoginUseCase(this.userRepo, this.refreshTokenRepo);
    const result = await usecase.execute({ email, password });
    return res.json(result);
  }
  async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;
    const usecase = new RefreshTokenUseCase(this.refreshTokenRepo, this.userRepo);
    const result = await usecase.execute({ token: refreshToken });
    return res.json(result);
  }
}
