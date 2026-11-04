function verificarLogin(req, res, next) {
  if (!req.session.usuario) {
    return res.status(401).json({ erro: 'Sessão expirada. Faça login novamente' });
  }
  next();
}

module.exports = verificarLogin;