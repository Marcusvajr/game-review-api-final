import { prisma } from "../../../infra/database/prismaClient";
import { IReviewRepository } from "../IReviewRepository";
import { Review } from "@prisma/client";
export class PrismaReviewRepository implements IReviewRepository {
  create(data: { rating: number; comment: string; gameId: number; authorId: number }): Promise<Review> {
    return prisma.review.create({ data });
  }
  update(id: number, data: { rating?: number; comment?: string }): Promise<Review> {
    return prisma.review.update({ where: { id }, data });
  }
  async delete(id: number): Promise<void> {
    await prisma.review.delete({ where: { id } });
  }
  findById(id: number): Promise<Review | null> {
    return prisma.review.findUnique({ where: { id } });
  }
  findByGameId(gameId: number): Promise<Review[]> {
    return prisma.review.findMany({ where: { gameId }, orderBy: { createdAt: "desc" } });
  }
  findByAuthorAndGame(authorId: number, gameId: number): Promise<Review | null> {
    return prisma.review.findFirst({ where: { authorId, gameId } });
  }
}
