const db = require('../config/db');

async function listar() {
  const [rows] = await db.query(
    `SELECT v.id, v.placa, v.modelo, v.cliente_id, c.nome AS cliente_nome
     FROM veiculos v
     JOIN clientes c ON v.cliente_id = c.id`
  );
  return rows;
}

async function criar({ placa, modelo, cliente_id }) {
  const [result] = await db.query(
    'INSERT INTO veiculos (placa, modelo, cliente_id) VALUES (?, ?, ?)',
    [placa, modelo, cliente_id]
  );
  return result.insertId;
}

module.exports = { listar, criar };