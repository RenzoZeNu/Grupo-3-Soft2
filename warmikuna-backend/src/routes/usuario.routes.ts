import { Router }               from "express";
import { body }                 from "express-validator";
import { UsuarioController }    from "../controllers/UsuarioController";
import { authMiddleware }       from "../middlewares/authMiddleware";

const router = Router();

// ── RUTAS PÚBLICAS ──

// Registro de usuario
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

// Login
router.post(
  "/login",
  body("correo").isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("Password obligatorio"),
  UsuarioController.login
);

// Recuperar / Cambiar contraseña
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

// ── RUTAS PROTEGIDAS (requieren JWT) ──
router.use(authMiddleware);

// Listar todos los usuarios (solo admin)
router.get("/", UsuarioController.obtenerTodos);

// Eliminar usuario (solo admin)
router.delete("/:id", UsuarioController.eliminarUsuario);

export default router;

