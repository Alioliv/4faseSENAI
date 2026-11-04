const db = require('../config/db');
const { descriptografar } = require('./clienteService');

async function listar() {
  const [rows] = await db.query(
    `SELECT os.id, os.descricao, os.data_agendamento,
            v.id AS veiculo_id, v.placa, v.modelo,
            c.id AS cliente_id, c.nome AS cliente_nome,
            c.cpf AS cliente_cpf, c.telefone AS cliente_telefone
     FROM ordens_servico os
     JOIN veiculos v ON os.veiculo_id = v.id
     JOIN clientes c ON v.cliente_id = c.id
     ORDER BY os.data_agendamento`
  );
  return rows.map((o) => ({ ...o, cliente_cpf: descriptografar(o.cliente_cpf) }));
}

async function criar({ descricao, data_agendamento, veiculo_id }) {
  const [result] = await db.query(
    'INSERT INTO ordens_servico (descricao, data_agendamento, veiculo_id) VALUES (?, ?, ?)',
    [descricao, data_agendamento, veiculo_id]
  );
  return result.insertId;
}

async function atualizarData(id, data_agendamento) {
  const [result] = await db.query(
    'UPDATE ordens_servico SET data_agendamento = ? WHERE id = ?',
    [data_agendamento, id]
  );
  return result.affectedRows;
}

module.exports = { listar, criar, atualizarData };
