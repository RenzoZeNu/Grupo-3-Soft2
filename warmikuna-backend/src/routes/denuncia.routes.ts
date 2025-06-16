import { Router, Request } from "express";
import { DenunciaController } from "../controllers/DenunciaController";
import { authMiddleware } from "../middlewares/authMiddleware";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

const router = Router();

// Denuncia sin archivo
router.post("/", authMiddleware, DenunciaController.crear as any);

// Denuncia con archivo
router.post(
  "/con-evidencia",
  authMiddleware,
  upload.single("archivo"),
  DenunciaController.crearConArchivo as any
);

// Consultar denuncias por usuario
router.get("/mis-denuncias", authMiddleware, DenunciaController.obtenerPorUsuario as any);

export default router;

