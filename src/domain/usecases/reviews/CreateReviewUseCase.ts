import { IReviewRepository } from "../../repositories/IReviewRepository";
import { IGameRepository } from "../../repositories/IGameRepository";
import { NotFoundError, ValidationError } from "../../../presentation/errors/AppError";
interface CreateReviewRequest { rating: number; comment?: string; gameId: number; authorId: number; }
export class CreateReviewUseCase {
  constructor(
    private reviewRepository: IReviewRepository,
    private gameRepository: IGameRepository
  ) {}
  async execute({ rating, comment, gameId, authorId }: CreateReviewRequest) {
    if (!authorId) throw new ValidationError("Usuário não identificado.");
    if (rating < 1 || rating > 5) throw new ValidationError("Rating deve ser entre 1 e 5.");
    if (comment && comment.length > 500) throw new ValidationError("Comentário deve ter no máximo 500 caracteres.");
    const game = await this.gameRepository.findById(gameId);
    if (!game) throw new NotFoundError("Jogo não encontrado.");
    const existing = await this.reviewRepository.findByAuthorAndGame(authorId, gameId);
    if (existing) throw new ValidationError("Você já avaliou este jogo.");
    const review = await this.reviewRepository.create({
      rating,
      comment: comment ?? "",
      gameId,
      authorId
    });
    await this.gameRepository.updateAvgRating(gameId);
    return review;
  }
}
