import { Router } from "express";
import { GameController } from "../presentation/controllers/GameController";
import { ensureAuth } from "../presentation/middlewares/authMiddleware";
import { ensureAdmin } from "../presentation/middlewares/ensureAdmin";
import { asyncHandler } from "../presentation/middlewares/asyncHandler";
import { gameRepository, reviewRepository } from "../infra/container";
const router = Router();
const controller = new GameController(gameRepository, reviewRepository);
/**
 * @openapi
 * /api/games:
 *   get:
 *     tags: [Games]
 *     summary: Lista jogos
 *     responses:
 *       200:
 *         description: Lista de jogos
 */
router.get("/", asyncHandler((req, res) => controller.list(req, res)));
/**
 * @openapi
 * /api/games/{id}:
 *   get:
 *     tags: [Games]
 *     summary: Detalha um jogo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Jogo encontrado
 *       404:
 *         description: Jogo não encontrado
 */
router.get("/:id", asyncHandler((req, res) => controller.find(req, res)));
/**
 * @openapi
 * /api/games/{id}/reviews:
 *   get:
 *     tags: [Games]
 *     summary: Lista reviews de um jogo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Reviews do jogo
 */
router.get("/:id/reviews", asyncHandler((req, res) => controller.reviews(req, res)));
/**
 * @openapi
 * /api/games:
 *   post:
 *     tags: [Games]
 *     summary: Cria um jogo (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, genre]
 *             properties:
 *               title: { type: string }
 *               genre: { type: string }
 *     responses:
 *       201:
 *         description: Jogo criado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado
 */
router.post("/", ensureAuth, ensureAdmin, asyncHandler((req, res) => controller.create(req, res)));
/**
 * @openapi
 * /api/games/{id}:
 *   put:
 *     tags: [Games]
 *     summary: Atualiza um jogo (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               genre: { type: string }
 *     responses:
 *       200:
 *         description: Jogo atualizado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado
 *       404:
 *         description: Jogo não encontrado
 */
router.put("/:id", ensureAuth, ensureAdmin, asyncHandler((req, res) => controller.update(req, res)));
/**
 * @openapi
 * /api/games/{id}:
 *   delete:
 *     tags: [Games]
 *     summary: Remove um jogo (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Removido
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado
 *       404:
 *         description: Jogo não encontrado
 */
router.delete("/:id", ensureAuth, ensureAdmin, asyncHandler((req, res) => controller.delete(req, res)));
/**
 * @openapi
 * /api/games/{id}/reviews:
 *   post:
 *     tags: [Games]
 *     summary: Cria review para um jogo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating]
 *             properties:
 *               rating: { type: integer, minimum: 1, maximum: 5 }
 *               comment: { type: string }
 *     responses:
 *       201:
 *         description: Review criada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Jogo não encontrado
 */
router.post("/:id/reviews", ensureAuth, asyncHandler((req, res) => controller.reviewGame(req, res)));
export default router;
