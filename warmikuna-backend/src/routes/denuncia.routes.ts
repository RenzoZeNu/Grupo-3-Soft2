// src/routes/denuncia.routes.ts
import { Router } from "express";
import { body } from "express-validator";
import multer from "multer";
import path from "path";

import { DenunciaController } from "../controllers/DenunciaController";
import { authMiddleware } from "../middlewares/authMiddleware";

const storage = multer.diskStorage({
  destination: (_, __, cb) =>
    cb(null, path.resolve(__dirname, "../../uploads")),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

const router = Router();

// Crear sin archivo → POST /api/denuncias
router.post(
  "/",
  authMiddleware,
  body("descripcion")
    .isString()
    .withMessage("La descripción debe ser texto")
    .isLength({ min: 10, max: 500 })
    .withMessage("Debe tener entre 10 y 500 caracteres"),
  body("anonima").isBoolean().withMessage("anonima debe ser booleano"),
  DenunciaController.crear
);

// Crear con archivo → POST /api/denuncias/con-evidencia
router.post(
  "/con-evidencia",
  authMiddleware,
  upload.single("archivo"),
  body("descripcion")
    .isString()
    .withMessage("La descripción debe ser texto")
    .isLength({ min: 10, max: 500 })
    .withMessage("Debe tener entre 10 y 500 caracteres"),
  body("anonima").isBoolean().withMessage("anonima debe ser booleano"),
  DenunciaController.crearConArchivo
);

export default router;






