import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { AdminController } from "../controllers/AdminController";

const router = Router();

router.get(
  "/denuncias",
  authMiddleware,
  adminMiddleware,
  AdminController.listarDenuncias
);

router.put(
  "/denuncias/:id/estado",
  authMiddleware,
  adminMiddleware,
  AdminController.cambiarEstado
);

router.get(
  "/usuarios",
  authMiddleware,
  adminMiddleware,
  AdminController.listarUsuarios
);

router.patch(
  "/usuarios/:id/rol",
  authMiddleware,
  adminMiddleware,
  AdminController.actualizarRol
);

router.delete(
  "/usuarios/:id",
  authMiddleware,
  adminMiddleware,
  AdminController.eliminarUsuario
);

export default router;
