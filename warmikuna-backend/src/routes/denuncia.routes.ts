import { Router } from "express";
import { DenunciaController } from "../controllers/DenunciaController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, DenunciaController.crear);
router.get("/mis-denuncias", authMiddleware, DenunciaController.listarPorUsuario);


export default router;
