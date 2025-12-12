import { IUserRepository } from "../../repositories/IUserRepository";
import bcrypt from "bcrypt";
import { ValidationError } from "../../../presentation/errors/AppError";
interface RegisterUserRequest { name: string; email: string; password: string; }
export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute({ name, email, password }: RegisterUserRequest) {
    if (!name || !name.trim()) throw new ValidationError("Nome é obrigatório.");
    if (!email || !email.trim()) throw new ValidationError("E-mail é obrigatório.");
    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new ValidationError("E-mail já está em uso.");
    if (!password || password.length < 6) throw new ValidationError("Senha deve ter ao menos 6 caracteres.");
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({ name, email, password: hashedPassword, role: "USER" });
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}
