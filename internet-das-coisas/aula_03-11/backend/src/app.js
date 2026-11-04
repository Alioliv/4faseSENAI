import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { db } from "./config/database.js";
import authRouter from "./routers/auth.js";
import materialsRouter from "./routers/materials.js";
import logsRouter from "./routers/logs.js";

dotenv.config();

// Cria a aplicacao Express diretamente.
const app = express();

// Compartilha o banco com os controllers.
app.locals.db = db;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));

// Converte o JSON do formulário em req.body.
app.use(express.json());

// Cada recurso tem seu proprio router.
app.use("/api", authRouter);
app.use("/api/materials", materialsRouter);
app.use("/api/logs", logsRouter);

// server.js importa esta aplicacao e abre a porta HTTP.
export default app;