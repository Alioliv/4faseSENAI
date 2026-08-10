import { Router } from 'express'
import * as clienteController from '../controllers/cliente.controller.js'

const router = Router()

router.get('/', clienteController.listar)
router.get('/:id', clienteController.buscarPorId)
router.post('/', clienteController.criar)
router.put('/:id', clienteController.editar)
router.delete('/:id', clienteController.excluir)

export default router
