
const bcrypt = require('bcrypt');
const db = require('../config/db');

async function login(email, senha) {
  const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  const usuario = rows[0];
  if (!usuario) return null;

  const senhaOk = await bcrypt.compare(senha, usuario.senha);
  if (!senhaOk) return null;

  return { id: usuario.id, nome: usuario.nome };
}

module.exports = { login };
