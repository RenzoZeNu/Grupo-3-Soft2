import { Router } from "express";
import { body } from "express-validator";
import multer from "multer";
import path from "path";

import { DenunciaController } from "../controllers/DenunciaController";
import { authMiddleware } from "../middlewares/authMiddleware";

const storage = multer.diskStorage({
  destination: (_, __, cb) =>
    cb(null, path.resolve(__dirname, "../../uploads")),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

const router = Router();

// GET /api/denuncias
router.get("/", authMiddleware, DenunciaController.obtenerPorUsuario);

// POST /api/denuncias
router.post(
  "/",
  authMiddleware,
  body("descripcion")
    .isString()
    .withMessage("La descripción debe ser texto")
    .isLength({ min: 1, max: 500 })
    .withMessage("La descripción debe tener entre 1 y 500 caracteres"),
  body("anonima").optional().toBoolean(),
  DenunciaController.crear
);

// POST /api/denuncias/con-evidencia
router.post(
  "/con-evidencia",
  authMiddleware,
  upload.single("archivo"),
  body("descripcion")
    .isString()
    .withMessage("La descripción debe ser texto")
    .isLength({ min: 1, max: 500 })
    .withMessage("La descripción debe tener entre 1 y 500 caracteres"),
  body("anonima").optional().toBoolean(),
  DenunciaController.crearConArchivo
);

export default router;



