import { IGameRepository } from "../../repositories/IGameRepository";
export class ListGamesUseCase {
  constructor(private gameRepository: IGameRepository) {}
  async execute() {
    return this.gameRepository.findAll();
  }
}
