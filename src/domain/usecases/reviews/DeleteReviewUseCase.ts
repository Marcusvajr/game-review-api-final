import { IReviewRepository } from "../../repositories/IReviewRepository";
import { IGameRepository } from "../../repositories/IGameRepository";
import { ForbiddenError, NotFoundError } from "../../../presentation/errors/AppError";
interface DeleteReviewRequest { id: number; requesterId: number; requesterRole?: string; }
export class DeleteReviewUseCase {
  constructor(
    private reviewRepository: IReviewRepository,
    private gameRepository: IGameRepository
  ) {}
  async execute({ id, requesterId, requesterRole }: DeleteReviewRequest) {
    const review = await this.reviewRepository.findById(id);
    if (!review) throw new NotFoundError("Review não encontrada.");
    if (review.authorId !== requesterId && requesterRole !== "ADMIN") {
      throw new ForbiddenError("Você não pode deletar esta review.");
    }
    await this.reviewRepository.delete(id);
    await this.gameRepository.updateAvgRating(review.gameId);
  }
}
