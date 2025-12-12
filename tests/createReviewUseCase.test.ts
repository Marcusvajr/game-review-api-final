import { CreateReviewUseCase } from "../src/domain/usecases/reviews/CreateReviewUseCase";
import { IReviewRepository } from "../src/domain/repositories/IReviewRepository";
import { IGameRepository } from "../src/domain/repositories/IGameRepository";
import { ValidationError } from "../src/presentation/errors/AppError";

class InMemoryReviewRepository implements IReviewRepository {
  public reviews: any[] = [];
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
  async findByGameId(gameId: number) {
    return this.reviews.filter(r => r.gameId === gameId) as any;
  }
  async findByAuthorAndGame(authorId: number, gameId: number) {
    return (this.reviews.find(r => r.authorId === authorId && r.gameId === gameId) as any) ?? null;
  }
}

class InMemoryGameRepository implements IGameRepository {
  private games = [{ id: 1, title: "Game 1", genre: "RPG", avgRating: 0 }];
  public updateAvgRatingCalled = 0;
  async create(data: { title: string; genre: string }) {
    const game = { ...data, id: this.games.length + 1, avgRating: 0, createdAt: new Date(), updatedAt: new Date() };
    this.games.push(game);
    return game as any;
  }
  async update(data: { id: number; title?: string; genre?: string }) {
    const game = this.games.find(g => g.id === data.id)!;
    Object.assign(game, data);
    return game as any;
  }
  async delete(id: number) {
    this.games = this.games.filter(g => g.id !== id);
  }
  async findById(id: number) {
    return (this.games.find(g => g.id === id) as any) ?? null;
  }
  async findByTitle(title: string) {
    return (this.games.find(g => g.title === title) as any) ?? null;
  }
  async findAll() {
    return this.games as any;
  }
  async updateAvgRating(gameId: number) {
    this.updateAvgRatingCalled += 1;
    const reviewsForGame = (globalThis as any).__reviews__ as any[] | undefined;
    if (reviewsForGame && reviewsForGame.length) {
      const avg =
        reviewsForGame.filter(r => r.gameId === gameId).reduce((acc, r) => acc + r.rating, 0) /
        reviewsForGame.filter(r => r.gameId === gameId).length;
      const game = this.games.find(g => g.id === gameId);
      if (game) game.avgRating = avg;
    }
  }
}

describe("CreateReviewUseCase", () => {
  it("should create a review and update avg rating", async () => {
    const reviewRepo = new InMemoryReviewRepository();
    const gameRepo = new InMemoryGameRepository();
    (globalThis as any).__reviews__ = reviewRepo.reviews;
    const usecase = new CreateReviewUseCase(reviewRepo, gameRepo);

    const review = await usecase.execute({ rating: 5, comment: "Great", gameId: 1, authorId: 10 });

    expect(review.id).toBe(1);
    expect(gameRepo.updateAvgRatingCalled).toBe(1);
  });

  it("should block more than one review per user per game", async () => {
    const reviewRepo = new InMemoryReviewRepository();
    const gameRepo = new InMemoryGameRepository();
    (globalThis as any).__reviews__ = reviewRepo.reviews;
    const usecase = new CreateReviewUseCase(reviewRepo, gameRepo);

    await usecase.execute({ rating: 4, comment: "Ok", gameId: 1, authorId: 10 });
    await expect(
      usecase.execute({ rating: 3, comment: "Again", gameId: 1, authorId: 10 })
    ).rejects.toBeInstanceOf(ValidationError);
  });
});
