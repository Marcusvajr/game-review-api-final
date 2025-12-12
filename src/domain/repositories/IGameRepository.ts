import { Game } from "@prisma/client";
export interface IGameRepository {
  create(data: { title: string; genre: string }): Promise<Game>;
  update(data: { id: number; title?: string; genre?: string }): Promise<Game>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Game | null>;
  findByTitle(title: string): Promise<Game | null>;
  findAll(): Promise<Game[]>;
  updateAvgRating(gameId: number): Promise<void>;
}
