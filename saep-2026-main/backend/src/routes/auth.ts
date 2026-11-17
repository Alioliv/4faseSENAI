import { Router } from 'express';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import { autenticar } from '../middlewares/auth';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, senha } = req.body ?? {};

  if (!email || !senha) {
    res.status(400).json({ mensagem: 'Informe e-mail e senha.' });
    return;
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, nome, senha FROM usuarios WHERE email = ?',
      [email]
    );
    const usuario = rows[0];

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
      return;
    }

    
    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });
    res.json({ nome: usuario.nome });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ mensagem: 'Sessão encerrada.' });
});

router.get('/me', autenticar, (req, res) => {
  res.json({ nome: res.locals.usuario.nome });
});

export default router;