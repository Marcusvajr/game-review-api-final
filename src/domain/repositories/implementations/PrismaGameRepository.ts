import { prisma } from "../../../infra/database/prismaClient";
import { IGameRepository } from "../IGameRepository";
import { Game } from "@prisma/client";
export class PrismaGameRepository implements IGameRepository {
  create(data: { title: string; genre: string }): Promise<Game> {
    return prisma.game.create({ data });
  }
  update(data: { id: number; title?: string; genre?: string }): Promise<Game> {
    const { id, ...rest } = data;
    return prisma.game.update({ where: { id }, data: rest });
  }
  async delete(id: number): Promise<void> {
    await prisma.game.delete({ where: { id } });
  }
  findById(id: number): Promise<Game | null> {
    return prisma.game.findUnique({ where: { id } });
  }
  findByTitle(title: string): Promise<Game | null> {
    return prisma.game.findUnique({ where: { title } });
  }
  findAll(): Promise<Game[]> {
    return prisma.game.findMany({ orderBy: { createdAt: "desc" } });
  }
  async updateAvgRating(gameId: number): Promise<void> {
    const result = await prisma.review.aggregate({
      where: { gameId },
      _avg: { rating: true }
    });
    await prisma.game.update({
      where: { id: gameId },
      data: { avgRating: result._avg.rating ?? 0 }
    });
  }
}
