import { NextFunction, Response } from "express";
import { AuthRequest } from "./authMiddleware";
import { ForbiddenError } from "../errors/AppError";
export function ensureAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.role !== "ADMIN") {
    throw new ForbiddenError("Acesso negado. Apenas administradores podem realizar esta ação.");
  }
  return next();
}
