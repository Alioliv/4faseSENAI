import { Router } from 'express'
import * as agendamentoController from '../controllers/agendamento.controller.js'

const router = Router()

router.get('/proximos', agendamentoController.proximos)

router.get('/', agendamentoController.listar)
router.get('/:id', agendamentoController.buscarPorId)
router.post('/', agendamentoController.criar)
router.put('/:id', agendamentoController.editar)
router.delete('/:id', agendamentoController.excluir)

export default router

