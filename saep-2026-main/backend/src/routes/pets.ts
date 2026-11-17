import { Router } from 'express';
import { RowDataPacket } from 'mysql2';
import pool from '../config/db';

const router = Router();

type Pet = {
  id: number;
  nome: string;
  especie: string;
  raca: string | null;
  data_nascimento: string | null;
  tutor_id: number;
  tutor_nome: string;
};


router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query<(Pet & RowDataPacket)[]>(
      `SELECT p.id, p.nome, p.especie, p.raca,
              DATE_FORMAT(p.data_nascimento, '%Y-%m-%d') AS data_nascimento,
              p.tutor_id, t.nome AS tutor_nome
         FROM pets p
         JOIN tutores t ON t.id = p.tutor_id
        ORDER BY p.nome`
    );
    res.json(rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao listar pets.' });
  }
});


router.post('/', async (req, res) => {
  const { nome, especie, raca, data_nascimento, tutor_id } = req.body ?? {};

  if (!nome?.trim()) {
    res.status(400).json({ mensagem: 'Informe o nome do pet.' });
    return;
  }
  if (!especie?.trim()) {
    res.status(400).json({ mensagem: 'Informe a espécie.' });
    return;
  }
  if (!tutor_id) {
    res.status(400).json({ mensagem: 'Selecione o tutor do pet.' });
    return;
  }

  try {
    const [tutor] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM tutores WHERE id = ?',
      [tutor_id]
    );
    if (tutor.length === 0) {
      res.status(400).json({ mensagem: 'Tutor não encontrado.' });
      return;
    }

    await pool.query(
      'INSERT INTO pets (nome, especie, raca, data_nascimento, tutor_id) VALUES (?, ?, ?, ?, ?)',
      [nome.trim(), especie.trim(), raca || null, data_nascimento || null, tutor_id]
    );
    res.status(201).json({ mensagem: 'Pet cadastrado.' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao cadastrar pet.' });
  }
});

export default router;