import { IGameRepository } from "../../repositories/IGameRepository";
import { NotFoundError, ValidationError } from "../../../presentation/errors/AppError";
interface UpdateGameRequest { id: number; title?: string; genre?: string; }
export class UpdateGameUseCase {
  constructor(private gameRepository: IGameRepository) {}
  async execute({ id, title, genre }: UpdateGameRequest) {
    const game = await this.gameRepository.findById(id);
    if (!game) throw new NotFoundError("Jogo não encontrado.");
    if (title !== undefined) {
      if (!title.trim()) throw new ValidationError("Título não pode ser vazio.");
      const existing = await this.gameRepository.findByTitle(title);
      if (existing && existing.id !== id) throw new ValidationError("Já existe um jogo com esse título.");
    }
    if (genre !== undefined && !genre.trim()) throw new ValidationError("Gênero não pode ser vazio.");
    const updated = await this.gameRepository.update({ id, title, genre });
    return updated;
  }
}
