import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Registro, login y recuperación
router.post("/registrar", UsuarioController.registrar);
router.post("/login", UsuarioController.login);
router.post("/recuperar", UsuarioController.recuperarContrasena);

// HU-12 / HU-13: preferencias (idioma y modo daltónico)
router.put(
  "/preferencias",
  authMiddleware,
  UsuarioController.actualizarPreferencias
);

export default router;

