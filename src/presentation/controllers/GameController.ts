import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { IGameRepository } from "../../domain/repositories/IGameRepository";
import { IReviewRepository } from "../../domain/repositories/IReviewRepository";
import { CreateGameUseCase } from "../../domain/usecases/games/CreateGameUseCase";
import { UpdateGameUseCase } from "../../domain/usecases/games/UpdateGameUseCase";
import { DeleteGameUseCase } from "../../domain/usecases/games/DeleteGameUseCase";
import { ListGamesUseCase } from "../../domain/usecases/games/ListGamesUseCase";
import { GetGameByIdUseCase } from "../../domain/usecases/games/GetGameByIdUseCase";
import { ListGameReviewsUseCase } from "../../domain/usecases/games/ListGameReviewsUseCase";
import { CreateReviewUseCase } from "../../domain/usecases/reviews/CreateReviewUseCase";
export class GameController {
  constructor(
    private gameRepo: IGameRepository,
    private reviewRepo: IReviewRepository
  ) {}
  async list(req: AuthRequest, res: Response) {
    const usecase = new ListGamesUseCase(this.gameRepo);
    const games = await usecase.execute();
    return res.json(games);
  }
  async find(req: AuthRequest, res: Response) {
    const id = Number(req.params.id);
    const usecase = new GetGameByIdUseCase(this.gameRepo);
    const game = await usecase.execute({ id });
    return res.json(game);
  }
  async reviews(req: AuthRequest, res: Response) {
    const gameId = Number(req.params.id);
    const usecase = new ListGameReviewsUseCase(this.reviewRepo);
    const reviews = await usecase.execute({ gameId });
    return res.json(reviews);
  }
  async create(req: AuthRequest, res: Response) {
    const { title, genre } = req.body;
    const usecase = new CreateGameUseCase(this.gameRepo);
    const game = await usecase.execute({ title, genre });
    return res.status(201).json(game);
  }
  async update(req: AuthRequest, res: Response) {
    const id = Number(req.params.id);
    const { title, genre } = req.body;
    const usecase = new UpdateGameUseCase(this.gameRepo);
    const game = await usecase.execute({ id, title, genre });
    return res.json(game);
  }
  async delete(req: AuthRequest, res: Response) {
    const id = Number(req.params.id);
    const usecase = new DeleteGameUseCase(this.gameRepo);
    await usecase.execute({ id });
    return res.status(204).send();
  }
  async reviewGame(req: AuthRequest, res: Response) {
    const gameId = Number(req.params.id);
    const { rating, comment } = req.body;
    const usecase = new CreateReviewUseCase(this.reviewRepo, this.gameRepo);
    const review = await usecase.execute({
      rating,
      comment,
      gameId,
      authorId: req.userId!
    });
    return res.status(201).json(review);
  }
}
