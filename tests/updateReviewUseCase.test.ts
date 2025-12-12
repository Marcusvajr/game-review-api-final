import { UpdateReviewUseCase } from "../src/domain/usecases/reviews/UpdateReviewUseCase";
import { IReviewRepository } from "../src/domain/repositories/IReviewRepository";
import { IGameRepository } from "../src/domain/repositories/IGameRepository";
import { ForbiddenError } from "../src/presentation/errors/AppError";

class InMemoryReviewRepository implements IReviewRepository {
  public reviews: any[] = [{ id: 1, rating: 4, comment: "Ok", gameId: 1, authorId: 10 }];
  async create(data: { rating: number; comment: string; gameId: number; authorId: number }) {
    const review = { ...data, id: this.reviews.length + 1, createdAt: new Date(), updatedAt: new Date() };
    this.reviews.push(review);
    return review as any;
  }
  async update(id: number, data: { rating?: number; comment?: string }) {
    const review = this.reviews.find(r => r.id === id);
    Object.assign(review, data, { updatedAt: new Date() });
    return review as any;
  }
  async delete(id: number) {
    this.reviews = this.reviews.filter(r => r.id !== id);
  }
  async findById(id: number) {
    return (this.reviews.find(r => r.id === id) as any) ?? null;
  }
  async findByGameId() {
    return [] as any;
  }
  async findByAuthorAndGame() {
    return null;
  }
}

class InMemoryGameRepository implements IGameRepository {
  async create(data: { title: string; genre: string }) {
    return { id: 99, ...data, avgRating: 0, createdAt: new Date(), updatedAt: new Date() } as any;
  }
  async update(data: { id: number; title?: string; genre?: string }) {
    return { id: data.id, title: "Game", genre: "RPG", avgRating: 0 } as any;
  }
  async delete() {
    return;
  }
  async findById(id: number) {
    return { id, title: "Game", genre: "RPG", avgRating: 0 } as any;
  }
  async findByTitle() {
    return null;
  }
  async findAll() {
    return [];
  }
  async updateAvgRating() {
    return;
  }
}

describe("UpdateReviewUseCase", () => {
  it("should prevent non-author non-admin from updating", async () => {
    const reviewRepo = new InMemoryReviewRepository();
    const gameRepo = new InMemoryGameRepository();
    const usecase = new UpdateReviewUseCase(reviewRepo, gameRepo);

    await expect(
      usecase.execute({
        id: 1,
        rating: 5,
        requesterId: 99,
        requesterRole: "USER"
      })
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("should allow admin to update any review", async () => {
    const reviewRepo = new InMemoryReviewRepository();
    const gameRepo = new InMemoryGameRepository();
    const usecase = new UpdateReviewUseCase(reviewRepo, gameRepo);

    const updated = await usecase.execute({
      id: 1,
      rating: 2,
      requesterId: 99,
      requesterRole: "ADMIN"
    });

    expect(updated.rating).toBe(2);
  });
});
