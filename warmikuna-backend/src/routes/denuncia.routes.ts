import { Router } from "express";
import { body } from "express-validator";
import multer from "multer";
import path from "path";

import { DenunciaController } from "../controllers/DenunciaController";
import { authMiddleware } from "../middlewares/authMiddleware";

const storage = multer.diskStorage({
  destination: (_, __, cb) =>
    cb(null, path.resolve(__dirname, "../../uploads")),
  filename: (_, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

const router = Router();

/** HU-14 – Listar todas las denuncias (admin) */
router.get(
  "/todas",
  authMiddleware,
  DenunciaController.obtenerTodas
);

/** HU-19c – Listar denuncias del usuario autenticado */
router.get(
  "/",
  authMiddleware,
  DenunciaController.obtenerPorUsuario
);

/** HU-15 – Actualizar estado de una denuncia (solo admin) */
router.patch(
  "/:id",
  authMiddleware,
  body("estado")
    .isIn(["pendiente", "en revisión", "cerrada"])
    .withMessage("Estado inválido"),
  DenunciaController.actualizarEstado
);

/** HU-19 – Crear denuncia sin archivo */
router.post(
  "/",
  authMiddleware,
  body("descripcion")
    .isString()
    .withMessage("La descripción debe ser texto")
    .isLength({ min: 1, max: 500 })
    .withMessage("Entre 1 y 500 caracteres"),
  body("anonima").optional().toBoolean(),
  DenunciaController.crear
);

/** HU-19b – Crear denuncia con archivo */
router.post(
  "/con-evidencia",
  authMiddleware,
  upload.single("archivo"),
  body("descripcion")
    .isString()
    .withMessage("La descripción debe ser texto")
    .isLength({ min: 1, max: 500 })
    .withMessage("Entre 1 y 500 caracteres"),
  body("anonima").optional().toBoolean(),
  DenunciaController.crearConArchivo
);

export default router;

