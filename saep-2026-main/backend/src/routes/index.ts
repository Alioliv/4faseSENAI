import { Router } from 'express';
import pool from '../config/db';
import { autenticar } from '../middlewares/auth';
import authRoutes from './auth';
import tutoresRoutes from './tutores';
import petsRoutes from './pets';
import agendamentosRoutes from './agendamentos';                    

       

const router = Router();


router.get('/status', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ api: 'online', banco: 'conectado' });
  } catch (erro) {
    console.error('Falha ao conectar no banco:', erro);
    res.json({ api: 'online', banco: 'sem conexão' });
  }
});

router.use('/auth', authRoutes);
router.use('/tutores', autenticar, tutoresRoutes);
router.use('/pets', autenticar, petsRoutes);
router.use('/agendamentos', autenticar, agendamentosRoutes);   

export default router;
