// warmikuna-backend/src/routes/usuario.routes.ts
import { Router } from "express";
import { body } from "express-validator";
import { UsuarioController } from "../controllers/UsuarioController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// POST /api/usuarios/registrar
router.post(
  "/registrar",
  body("nombre").isString().withMessage("Nombre obligatorio"),
  body("correo").isEmail().withMessage("Email inválido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password mínimo 6 caracteres"),
  body("dni")
    .isLength({ min: 8, max: 8 })
    .withMessage("DNI debe tener 8 dígitos")
    .isNumeric()
    .withMessage("DNI solo números"),
  UsuarioController.registrar
);

// POST /api/usuarios/login
router.post(
  "/login",
  body("correo").isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("Password obligatorio"),
  UsuarioController.login
);

// POST /api/usuarios/cambiar-contrasena
router.post(
  "/cambiar-contrasena",
  authMiddleware,
  body("oldPassword").notEmpty().withMessage("Contraseña actual obligatoria"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Nueva contraseña mínimo 6 caracteres"),
  UsuarioController.cambiarContrasena
);

export default router;


