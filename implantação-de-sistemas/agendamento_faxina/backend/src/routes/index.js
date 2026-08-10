import { Router } from 'express'
import clienteRoutes from './cliente.routes.js'
import profissionalRoutes from './profissional.routes.js'
import agendamentoRoutes from './agendamento.routes.js'

const router = Router()

router.use('/clientes', clienteRoutes)
router.use('/profissionais', profissionalRoutes)
router.use('/agendamentos', agendamentoRoutes)

export default router
