import { Router } from 'express'
import clienteRoutes from './cliente.routes.js'
import profissionalRoutes from './profissional.routes.js'
import agendamentoRoutes from './agendamento.routes.js'
import authRoutes from './auth.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/clientes', clienteRoutes)
router.use('/profissionais', profissionalRoutes)
router.use('/agendamentos', agendamentoRoutes)

export default router