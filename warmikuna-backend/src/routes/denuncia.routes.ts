import { Router } from "express";
import { DenunciaController } from "../controllers/DenunciaController";
import { authMiddleware } from "../middlewares/authMiddleware";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) =>
    cb(null, path.join(__dirname, "../../uploads")),
  filename: (_req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

const router = Router();

// Registrar denuncia sin archivo
router.post("/", authMiddleware, DenunciaController.crear);

// Registrar denuncia con archivo
router.post(
  "/con-evidencia",
  authMiddleware,
  upload.single("archivo"),
  DenunciaController.crearConArchivo
);

// Obtener denuncias del usuario
router.get("/mis-denuncias", authMiddleware, DenunciaController.obtenerPorUsuario);

// Actualizar estado de denuncia
router.put("/:id/estado", authMiddleware, DenunciaController.actualizarEstado);

export default router;
