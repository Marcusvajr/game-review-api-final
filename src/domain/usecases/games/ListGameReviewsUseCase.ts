import { IReviewRepository } from "../../repositories/IReviewRepository";
interface ListGameReviewsRequest { gameId: number; }
export class ListGameReviewsUseCase {
  constructor(private reviewRepository: IReviewRepository) {}
  async execute({ gameId }: ListGameReviewsRequest) {
    return this.reviewRepository.findByGameId(gameId);
  }
}
