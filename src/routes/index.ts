import { Router } from "express";
import authRoutes from "./auth.routes";
import gameRoutes from "./game.routes";
import reviewRoutes from "./review.routes";
const router = Router();
router.use("/auth", authRoutes);
router.use("/games", gameRoutes);
router.use("/reviews", reviewRoutes);
export { router };
