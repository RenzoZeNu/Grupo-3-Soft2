import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";

const router = Router();

router.post("/registrar", UsuarioController.registrar);
router.post("/login", UsuarioController.login);
router.post("/recuperar-contrasena", UsuarioController.recuperarContrasena); // ✅ ESTA

export default router;
