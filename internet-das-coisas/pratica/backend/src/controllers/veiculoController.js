const veiculoService = require('../services/veiculoService');

async function listar(req, res) {
  try {
    res.json(await veiculoService.listar());
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar veículos' });
  }
}

async function criar(req, res) {
  const { placa, modelo, cliente_id } = req.body;
  if (!placa || !modelo || !cliente_id) {
    return res.status(400).json({ erro: 'Placa, modelo e cliente são obrigatórios' });
  }
  try {
    const id = await veiculoService.criar({ placa, modelo, cliente_id });
    res.status(201).json({ id });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ erro: 'Cliente informado não existe' });
    }
    res.status(500).json({ erro: 'Erro ao cadastrar veículo' });
  }
}

module.exports = { listar, criar };




