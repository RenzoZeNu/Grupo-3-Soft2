import { Router } from "express";
import { EvidenciaController } from "../controllers/EvidenciaController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, EvidenciaController.adjuntar as any); 

export default router;

