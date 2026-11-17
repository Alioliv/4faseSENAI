import { Router } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/db';
import { descriptografar } from '../utils/cripto';

const router = Router();

type Agendamento = {
  id: number;
  data_agendamento: string;
  motivo: string;
  status: string;
  pet_id: number;
  pet_nome: string;
  pet_especie: string;
  pet_raca: string | null;
  pet_nascimento: string | null;
  tutor_id: number;
  tutor_nome: string;
  tutor_cpf: string;
  tutor_telefone: string;
  tutor_email: string | null;
  tutor_endereco: string | null;
};

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query<(Agendamento & RowDataPacket)[]>(
      `SELECT a.id,
              DATE_FORMAT(a.data_agendamento, '%Y-%m-%dT%H:%i') AS data_agendamento,
              a.motivo, a.status,
              p.id AS pet_id, p.nome AS pet_nome, p.especie AS pet_especie,
              p.raca AS pet_raca,
              DATE_FORMAT(p.data_nascimento, '%Y-%m-%d') AS pet_nascimento,
              t.id AS tutor_id, t.nome AS tutor_nome, t.cpf AS tutor_cpf,
              t.telefone AS tutor_telefone, t.email AS tutor_email,
              t.endereco AS tutor_endereco
         FROM agendamentos a
         JOIN pets p ON p.id = a.pet_id
         JOIN tutores t ON t.id = p.tutor_id
        ORDER BY a.data_agendamento`
    );

    res.json(rows.map((a) => ({ ...a, tutor_cpf: descriptografar(a.tutor_cpf) })));
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao listar agendamentos.' });
  }
});


router.put('/:id', async (req, res) => {
  const data = String(req.body?.data_agendamento ?? '').trim();

  if (!/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(data)) {
    res.status(400).json({ mensagem: 'Informe uma data e hora válidas.' });
    return;
  }

  // 2026-11-20T09:00 -> 2026-11-20 09:00:00
  const dataMysql = data.replace('T', ' ').slice(0, 16) + ':00';

  try {
    const [resultado] = await pool.query<ResultSetHeader>(
      'UPDATE agendamentos SET data_agendamento = ? WHERE id = ?',
      [dataMysql, req.params.id]
    );

    if (resultado.affectedRows === 0) {
      res.status(404).json({ mensagem: 'Agendamento não encontrado.' });
      return;
    }
    res.json({ mensagem: 'Data do agendamento atualizada.' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao atualizar agendamento.' });
  }
});

export default router;
