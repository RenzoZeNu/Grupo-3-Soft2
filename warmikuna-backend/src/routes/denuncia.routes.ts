import { Router }              from "express";
import { DenunciaController }  from "../controllers/DenunciaController";
import { authMiddleware }      from "../middlewares/authMiddleware";
import multer                  from "multer";
import path                    from "path";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) =>
    cb(null, path.join(__dirname, "../../uploads")),
  filename: (_req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

const router = Router();

// HU-19: crear denuncia sin archivo
router.post(
  "/",
  authMiddleware,
  DenunciaController.crear
);

// HU-19b: crear denuncia con archivo
router.post(
  "/con-evidencia",
  authMiddleware,
  upload.single("archivo"),
  DenunciaController.crearConArchivo
);

// HU-19c: listar denuncias del usuario
router.get(
  "/mis-denuncias",
  authMiddleware,
  DenunciaController.obtenerPorUsuario
);

// HU-20: actualizar estado de denuncia
router.put(
  "/:id/estado",
  authMiddleware,
  DenunciaController.actualizarEstado
);

export default router;


