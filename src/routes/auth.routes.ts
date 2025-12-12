import { Router } from "express";
import { AuthController } from "../presentation/controllers/AuthController";
import { userRepository, refreshTokenRepository } from "../infra/container";
import { asyncHandler } from "../presentation/middlewares/asyncHandler";
const router = Router();
const controller = new AuthController(userRepository, refreshTokenRepository);
/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Cria um usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *     responses:
 *       201:
 *         description: Usuário criado
 *       400:
 *         description: Dados inválidos
 */
router.post("/register", asyncHandler((req, res) => controller.register(req, res)));
/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Autentica e gera tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Tokens retornados
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", asyncHandler((req, res) => controller.login(req, res)));
/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Gera um novo access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Novo access token
 *       401:
 *         description: Refresh token inválido ou expirado
 */
router.post("/refresh", asyncHandler((req, res) => controller.refresh(req, res)));
export default router;
