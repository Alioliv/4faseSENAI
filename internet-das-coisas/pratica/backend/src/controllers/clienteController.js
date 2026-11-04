const clienteService = require('../services/clienteService');

async function listar(req, res) {
  try {
    res.json(await clienteService.listar(req.query.busca));
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar clientes' });
  }
}

async function criar(req, res) {
  const { nome, cpf, telefone, senha } = req.body;
  if (!nome || !cpf || !senha) {
    return res.status(400).json({ erro: 'Nome, CPF e senha são obrigatórios' });
  }
  try {
    const id = await clienteService.criar({ nome, cpf, telefone, senha });
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar cliente' });
  }
}

async function atualizar(req, res) {
  const { nome, cpf, telefone } = req.body;
  if (!nome || !cpf) {
    return res.status(400).json({ erro: 'Nome e CPF são obrigatórios' });
  }
  try {
    const linhas = await clienteService.atualizar(req.params.id, { nome, cpf, telefone });
    if (!linhas) return res.status(404).json({ erro: 'Cliente não encontrado' });
    res.json({ mensagem: 'Cliente atualizado' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar cliente' });
  }
}

async function excluir(req, res) {
  try {
    const linhas = await clienteService.excluir(req.params.id);
    if (!linhas) return res.status(404).json({ erro: 'Cliente não encontrado' });
    res.json({ mensagem: 'Cliente excluído' });
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ erro: 'Cliente possui veículos cadastrados' });
    }
    res.status(500).json({ erro: 'Erro ao excluir cliente' });
  }
}

module.exports = { listar, criar, atualizar, excluir };

