import { IGameRepository } from "../../repositories/IGameRepository";
import { NotFoundError } from "../../../presentation/errors/AppError";
interface GetGameByIdRequest { id: number; }
export class GetGameByIdUseCase {
  constructor(private gameRepository: IGameRepository) {}
  async execute({ id }: GetGameByIdRequest) {
    const game = await this.gameRepository.findById(id);
    if (!game) throw new NotFoundError("Jogo não encontrado.");
    return game;
  }
}
