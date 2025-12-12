import { Router } from "express";
import { ReviewController } from "../presentation/controllers/ReviewController";
import { ensureAuth } from "../presentation/middlewares/authMiddleware";
import { asyncHandler } from "../presentation/middlewares/asyncHandler";
import { gameRepository, reviewRepository } from "../infra/container";
const router = Router();
const controller = new ReviewController(reviewRepository, gameRepository);
/**
 * @openapi
 * /api/reviews/game/{gameId}:
 *   post:
 *     tags: [Reviews]
 *     summary: Cria review para um jogo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
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
router.post("/game/:gameId", ensureAuth, asyncHandler((req, res) => controller.create(req, res)));
/**
 * @openapi
 * /api/reviews/{id}:
 *   put:
 *     tags: [Reviews]
 *     summary: Atualiza uma review
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
 *               rating: { type: integer, minimum: 1, maximum: 5 }
 *               comment: { type: string }
 *     responses:
 *       200:
 *         description: Review atualizada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado
 *       404:
 *         description: Review não encontrada
 */
router.put("/:id", ensureAuth, asyncHandler((req, res) => controller.update(req, res)));
/**
 * @openapi
 * /api/reviews/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Deleta uma review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Review removida
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado
 *       404:
 *         description: Review não encontrada
 */
router.delete("/:id", ensureAuth, asyncHandler((req, res) => controller.delete(req, res)));
/**
 * @openapi
 * /api/reviews/game/{gameId}:
 *   get:
 *     tags: [Reviews]
 *     summary: Lista reviews de um jogo
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Lista de reviews
 */
router.get("/game/:gameId", asyncHandler((req, res) => controller.listByGame(req, res)));
export default router;
