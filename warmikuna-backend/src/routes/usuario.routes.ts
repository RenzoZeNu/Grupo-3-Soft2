// File: warmikuna-backend/src/routes/usuario.routes.ts

import { Router } from "express";
import { body } from "express-validator";
import { UsuarioController } from "../controllers/UsuarioController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Rutas públicas
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

router.post(
  "/login",
  body("correo").isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("Password obligatorio"),
  UsuarioController.login
);

router.post(
  "/cambiar-contrasena",
  body("correo").isEmail().withMessage("Email inválido"),
  body("dni")
    .isLength({ min: 8, max: 8 })
    .withMessage("DNI debe tener 8 dígitos")
    .isNumeric()
    .withMessage("DNI solo números"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Contraseña mínimo 6 caracteres"),
  UsuarioController.cambiarContrasena
);

// Middleware de autenticación para las siguientes rutas
router.use(authMiddleware);

// HU-16a – Listar todos los usuarios (solo admin)
router.get("/", UsuarioController.obtenerTodos);

// HU-16d – Eliminar usuario (solo admin)
router.delete("/:id", UsuarioController.eliminarUsuario);

export default router;
