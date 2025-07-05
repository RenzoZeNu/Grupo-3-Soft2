// warmikuna-backend/src/routes/denuncia.routes.ts
import { Router } from "express";
import { body } from "express-validator";
import multer from "multer";
import path from "path";

import { DenunciaController } from "../controllers/DenunciaController";

const storage = multer.diskStorage({
  destination: (_, __, cb) =>
    cb(null, path.resolve(__dirname, "../../uploads")),
  filename: (_, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

const router = Router();

// GET  /api/denuncias
router.get(
  "/",
  DenunciaController.obtenerPorUsuario
);

// POST /api/denuncias
router.post(
  "/",
  body("descripcion")
    .isString().withMessage("La descripción debe ser texto")
    .isLength({ min: 1, max: 500 }).withMessage("Entre 1 y 500 caracteres"),
  body("anonima").optional().toBoolean(),
  DenunciaController.crear
);

// POST /api/denuncias/con-evidencia
router.post(
  "/con-evidencia",
  upload.single("archivo"),
  body("descripcion")
    .isString().withMessage("La descripción debe ser texto")
    .isLength({ min: 1, max: 500 }).withMessage("Entre 1 y 500 caracteres"),
  body("anonima").optional().toBoolean(),
  DenunciaController.crearConArchivo
);

export default router;




