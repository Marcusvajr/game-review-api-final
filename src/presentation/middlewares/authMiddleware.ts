import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AuthenticationError } from "../errors/AppError";

export interface AuthRequest extends Request {
  userId?: number;
  role?: string;
}

export function ensureAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new AuthenticationError("Token não informado.");

  const [, token] = authHeader.split(" ");
  if (!token) throw new AuthenticationError("Token mal formatado.");

  try {
    const payload: any = jwt.verify(token, env.jwtAccessSecret);
    req.userId = Number(payload.sub);
    req.role = payload.role;
    return next();
  } catch {
    throw new AuthenticationError("Token inválido ou expirado.");
  }
}
