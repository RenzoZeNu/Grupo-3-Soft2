// warmikuna-backend/src/app.ts
import "reflect-metadata";
import express from "express";
import cors from "cors";
import path from "path";

import usuarioRoutes from "./routes/usuario.routes";
import denunciaRoutes from "./routes/denuncia.routes";
import evidenciaRoutes from "./routes/evidencia.routes";
import adminRoutes from "./routes/admin.routes";
import { authMiddleware } from "./middlewares/authMiddleware";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

// 1) CORS global + permitir Authorization en preflight
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
// Preflight para todas las rutas
app.options("*", cors());

// 2) Parser JSON
app.use(express.json());

// 3) Archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 4) Rutas públicas
app.use("/api/usuarios", usuarioRoutes);

// 5) Rutas protegidas con JWT
app.use("/api/denuncias", authMiddleware, denunciaRoutes);
app.use("/api/evidencias", authMiddleware, evidenciaRoutes);
app.use("/api/admin", authMiddleware, adminRoutes);

// 6) Manejo de errores
app.use(errorHandler);

export default app;



