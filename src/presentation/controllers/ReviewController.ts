import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { IReviewRepository } from "../../domain/repositories/IReviewRepository";
import { IGameRepository } from "../../domain/repositories/IGameRepository";
import { CreateReviewUseCase } from "../../domain/usecases/reviews/CreateReviewUseCase";
import { UpdateReviewUseCase } from "../../domain/usecases/reviews/UpdateReviewUseCase";
import { DeleteReviewUseCase } from "../../domain/usecases/reviews/DeleteReviewUseCase";
import { ListGameReviewsUseCase } from "../../domain/usecases/games/ListGameReviewsUseCase";
export class ReviewController {
  constructor(
    private reviewRepo: IReviewRepository,
    private gameRepo: IGameRepository
  ) {}
  async create(req: AuthRequest, res: Response) {
    const gameId = Number(req.params.gameId);
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
  async update(req: AuthRequest, res: Response) {
    const id = Number(req.params.id);
    const { rating, comment } = req.body;
    const usecase = new UpdateReviewUseCase(this.reviewRepo, this.gameRepo);
    const review = await usecase.execute({
      id,
      rating,
      comment,
      requesterId: req.userId!,
      requesterRole: req.role
    });
    return res.json(review);
  }
  async delete(req: AuthRequest, res: Response) {
    const id = Number(req.params.id);
    const usecase = new DeleteReviewUseCase(this.reviewRepo, this.gameRepo);
    await usecase.execute({
      id,
      requesterId: req.userId!,
      requesterRole: req.role
    });
    return res.status(204).send();
  }
  async listByGame(req: AuthRequest, res: Response) {
    const gameId = Number(req.params.gameId);
    const usecase = new ListGameReviewsUseCase(this.reviewRepo);
    const reviews = await usecase.execute({ gameId });
    return res.json(reviews);
  }
}
