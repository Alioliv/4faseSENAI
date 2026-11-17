import { Router } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/db';
import { criptografar, descriptografar } from '../utils/cripto';

const router = Router();

type Tutor = {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string | null;
  endereco: string | null;
};

const soDigitos = (v: unknown) => String(v ?? '').replace(/\D/g, '');


function validar(corpo: any): string | null {
  if (!corpo?.nome?.trim()) return 'Informe o nome.';
  if (soDigitos(corpo.cpf).length !== 11) return 'CPF deve ter 11 dígitos.';
  if (!corpo?.telefone?.trim()) return 'Informe o telefone.';
  return null;
}


router.get('/', async (req, res) => {
  try {
    const busca = String(req.query.busca ?? '').trim().toLowerCase();

    const [rows] = await pool.query<(Tutor & RowDataPacket)[]>(
      'SELECT id, nome, cpf, telefone, email, endereco FROM tutores ORDER BY nome'
    );

    let tutores: Tutor[] = rows.map((t) => ({ ...t, cpf: descriptografar(t.cpf) }));

    if (busca) {
      const digitos = soDigitos(busca);
      tutores = tutores.filter(
        (t) =>
          [t.nome, t.email ?? '', t.telefone].some((c) => c.toLowerCase().includes(busca)) ||
          (digitos !== '' && t.cpf.includes(digitos))
      );
    }
    res.json(tutores);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao listar tutores.' });
  }
});


router.post('/', async (req, res) => {
  const erro = validar(req.body);
  if (erro) {
    res.status(400).json({ mensagem: erro });
    return;
  }
  const { nome, cpf, telefone, email, endereco } = req.body;

  try {
    await pool.query(
      'INSERT INTO tutores (nome, cpf, telefone, email, endereco) VALUES (?, ?, ?, ?, ?)',
      [nome.trim(), criptografar(soDigitos(cpf)), telefone.trim(), email || null, endereco || null]
    );
    res.status(201).json({ mensagem: 'Tutor cadastrado.' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao cadastrar tutor.' });
  }
});


router.put('/:id', async (req, res) => {
  const erro = validar(req.body);
  if (erro) {
    res.status(400).json({ mensagem: erro });
    return;
  }
  const { nome, cpf, telefone, email, endereco } = req.body;

  try {
    const [resultado] = await pool.query<ResultSetHeader>(
      'UPDATE tutores SET nome = ?, cpf = ?, telefone = ?, email = ?, endereco = ? WHERE id = ?',
      [nome.trim(), criptografar(soDigitos(cpf)), telefone.trim(), email || null, endereco || null, req.params.id]
    );

    if (resultado.affectedRows === 0) {
      res.status(404).json({ mensagem: 'Tutor não encontrado.' });
      return;
    }
    res.json({ mensagem: 'Tutor atualizado.' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao atualizar tutor.' });
  }
});

export default router;