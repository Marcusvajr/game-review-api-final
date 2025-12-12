import { CreateGameUseCase } from "../src/domain/usecases/games/CreateGameUseCase";
import { IGameRepository } from "../src/domain/repositories/IGameRepository";
import { ValidationError } from "../src/presentation/errors/AppError";
class InMemoryGameRepository implements IGameRepository {
  private games: any[] = [];
  async create(data: { title: string; genre: string }) {
    const game = { ...data, id: this.games.length + 1, avgRating: 0, createdAt: new Date(), updatedAt: new Date() };
    this.games.push(game);
    return game;
  }
  async update(data: { id: number; title?: string; genre?: string }) {
    const game = this.games.find(g => g.id === data.id);
    Object.assign(game, data);
    return game;
  }
  async delete(id: number) {
    this.games = this.games.filter(g => g.id !== id);
  }
  async findById(id: number) {
    return this.games.find(g => g.id === id) ?? null;
  }
  async findByTitle(title: string) {
    return this.games.find(g => g.title === title) ?? null;
  }
  async findAll() {
    return this.games;
  }
  async updateAvgRating(_gameId: number) { return; }
}
describe("CreateGameUseCase", () => {
  it("should create a new game", async () => {
    const repo = new InMemoryGameRepository();
    const usecase = new CreateGameUseCase(repo);
    const game = await usecase.execute({ title: "Persona 3 Reload", genre: "RPG" });
    expect(game.id).toBe(1);
    expect(game.title).toBe("Persona 3 Reload");
  });
  it("should not create a game with empty title", async () => {
    const repo = new InMemoryGameRepository();
    const usecase = new CreateGameUseCase(repo);
    await expect(usecase.execute({ title: "   ", genre: "RPG" })).rejects.toBeInstanceOf(ValidationError);
  });
});
