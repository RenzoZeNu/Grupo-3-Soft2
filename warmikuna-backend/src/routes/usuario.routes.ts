import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Registro de usuario
router.post("/registrar", UsuarioController.registrar);

// Login
router.post("/login", UsuarioController.login);

// Recuperar contraseña
router.post("/recuperar", UsuarioController.recuperarContrasena);

// Actualizar idioma y modo daltónico (requiere autenticación)
router.put(
  "/preferencias",
  authMiddleware,
  UsuarioController.actualizarPreferencias
);

export default router;
