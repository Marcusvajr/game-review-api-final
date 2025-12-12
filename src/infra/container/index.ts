import { PrismaUserRepository } from "../../domain/repositories/implementations/PrismaUserRepository";
import { PrismaGameRepository } from "../../domain/repositories/implementations/PrismaGameRepository";
import { PrismaReviewRepository } from "../../domain/repositories/implementations/PrismaReviewRepository";
import { PrismaRefreshTokenRepository } from "../../domain/repositories/implementations/PrismaRefreshTokenRepository";
export const userRepository = new PrismaUserRepository();
export const gameRepository = new PrismaGameRepository();
export const reviewRepository = new PrismaReviewRepository();
export const refreshTokenRepository = new PrismaRefreshTokenRepository();
