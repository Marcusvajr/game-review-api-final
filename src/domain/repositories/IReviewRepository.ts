import { Review } from "@prisma/client";
export interface IReviewRepository {
  create(data: { rating: number; comment: string; gameId: number; authorId: number }): Promise<Review>;
  update(id: number, data: { rating?: number; comment?: string }): Promise<Review>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Review | null>;
  findByGameId(gameId: number): Promise<Review[]>;
  findByAuthorAndGame(authorId: number, gameId: number): Promise<Review | null>;
}
