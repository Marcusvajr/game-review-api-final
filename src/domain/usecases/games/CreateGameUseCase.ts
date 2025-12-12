import { IGameRepository } from "../../repositories/IGameRepository";
import { ValidationError } from "../../../presentation/errors/AppError";
interface CreateGameRequest { title: string; genre: string; }
export class CreateGameUseCase {
  constructor(private gameRepository: IGameRepository) {}
  async execute({ title, genre }: CreateGameRequest) {
    if (!title || !title.trim()) throw new ValidationError("Título é obrigatório.");
    if (!genre || !genre.trim()) throw new ValidationError("Gênero é obrigatório.");
    const existing = await this.gameRepository.findByTitle(title);
    if (existing) throw new ValidationError("Já existe um jogo com esse título.");
    const game = await this.gameRepository.create({ title, genre });
    return game;
  }
}
