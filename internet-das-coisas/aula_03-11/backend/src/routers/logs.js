import { Router } from "express";
import { listLogs } from "../controllers/log.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

// Logs contem informacoes de auditoria: primeiro autenticamos o usuario.
router.use(authenticate);
// Somente administradores podem consultar o historico de alteracoes.

export default router;
