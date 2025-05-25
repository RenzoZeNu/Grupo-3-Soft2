import { Router } from "express";
import { DenunciaController } from "../controllers/DenunciaController";
import { authMiddleware } from "../middlewares/authMiddleware";
import multer from "multer";

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

const router = Router();

// Denuncia sin archivo
router.post("/", authMiddleware, DenunciaController.crear);

// Denuncia con archivo
router.post(
  "/con-evidencia",
  authMiddleware,
  upload.single("archivo"),
  DenunciaController.crearConArchivo
);

// 🔥 ESTA es la ruta que te falta definir:
router.get("/mis-denuncias", authMiddleware, DenunciaController.obtenerPorUsuario);

export default router;
