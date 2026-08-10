import { Router } from 'express'
import * as profissionalController from '../controllers/profissional.controller.js'

const router = Router()

router.get('/', profissionalController.listar)
router.get('/:id', profissionalController.buscarPorId)
router.post('/', profissionalController.criar)
router.put('/:id', profissionalController.editar)
router.delete('/:id', profissionalController.excluir)

export default router
