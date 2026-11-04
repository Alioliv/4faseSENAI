import { Router } from "express";
import { addMaterial, listMaterials, editMaterial, deleteMaterial } from "../controllers/materials.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

// todas as rotas abaixo exigem um token valido.
router.use(authenticate);
// Admin e usuario podem consultar.
router.get("/", listMaterials);
// So admins podem adicionar, editar ou excluir materiais.

export default router;
