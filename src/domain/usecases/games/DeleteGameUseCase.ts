import { IGameRepository } from "../../repositories/IGameRepository";
import { NotFoundError } from "../../../presentation/errors/AppError";
interface DeleteGameRequest { id: number; }
export class DeleteGameUseCase {
  constructor(private gameRepository: IGameRepository) {}
  async execute({ id }: DeleteGameRequest) {
    const game = await this.gameRepository.findById(id);
    if (!game) throw new NotFoundError("Jogo não encontrado.");
    await this.gameRepository.delete(id);
  }
}
