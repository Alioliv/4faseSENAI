const authService = require('../services/authService');

async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Preencha email e senha' });
  }

  try {
    const usuario = await authService.login(email, senha);
    if (!usuario) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' });
    }
    req.session.usuario = usuario;
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao fazer login' });
  }
}

function logout(req, res) {
  req.session.destroy(() => {
    res.json({ mensagem: 'Saiu com sucesso' });
  });
}

function me(req, res) {
  if (!req.session.usuario) {
    return res.status(401).json({ erro: 'Sessão expirada. Faça login novamente' });
  }
  res.json(req.session.usuario);
}

module.exports = { login, logout, me };