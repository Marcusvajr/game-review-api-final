import { IReviewRepository } from "../../repositories/IReviewRepository";
import { IGameRepository } from "../../repositories/IGameRepository";
import { ForbiddenError, NotFoundError, ValidationError } from "../../../presentation/errors/AppError";
interface UpdateReviewRequest {
  id: number;
  rating?: number;
  comment?: string;
  requesterId: number;
  requesterRole?: string;
}
export class UpdateReviewUseCase {
  constructor(
    private reviewRepository: IReviewRepository,
    private gameRepository: IGameRepository
  ) {}
  async execute({ id, rating, comment, requesterId, requesterRole }: UpdateReviewRequest) {
    if (rating === undefined && comment === undefined) {
      throw new ValidationError("Nenhum dado enviado para atualizar.");
    }
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      throw new ValidationError("Rating deve ser entre 1 e 5.");
    }
    if (comment !== undefined) {
      if (!comment.trim()) throw new ValidationError("Comentário não pode ser vazio.");
      if (comment.length > 500) throw new ValidationError("Comentário deve ter no máximo 500 caracteres.");
    }
    const review = await this.reviewRepository.findById(id);
    if (!review) throw new NotFoundError("Review não encontrada.");
    if (review.authorId !== requesterId && requesterRole !== "ADMIN") {
      throw new ForbiddenError("Você não pode editar esta review.");
    }
    const updated = await this.reviewRepository.update(id, { rating, comment });
    await this.gameRepository.updateAvgRating(updated.gameId);
    return updated;
  }
}
