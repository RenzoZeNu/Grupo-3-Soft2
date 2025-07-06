import { Router } from "express";
import { body }   from "express-validator";
import { UsuarioController } from "../controllers/UsuarioController";
import { authMiddleware }    from "../middlewares/authMiddleware";

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
    .isNumeric().withMessage("DNI solo números"),
  UsuarioController.registrar
);

// POST /api/usuarios/login
router.post(
  "/login",
  body("correo").isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("Password obligatorio"),
  UsuarioController.login
);

// POST /api/usuarios/cambiar-contrasena  ← pública, recibe { correo, dni, password }
router.post(
  "/cambiar-contrasena",
  body("correo").isEmail().withMessage("Email inválido"),
  body("dni")
    .isLength({ min: 8, max: 8 })
    .withMessage("DNI debe tener 8 dígitos")
    .isNumeric().withMessage("DNI solo números"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Contraseña mínimo 6 caracteres"),
  UsuarioController.cambiarContrasena
);

router.use(authMiddleware);

export default router;
