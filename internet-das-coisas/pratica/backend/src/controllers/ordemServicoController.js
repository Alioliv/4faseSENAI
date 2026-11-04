const ordemServicoService = require('../services/ordemServicoService');

async function listar(req, res) {
  try {
    res.json(await ordemServicoService.listar());
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar ordens de serviço' });
  }
}

async function criar(req, res) {
  const { descricao, data_agendamento, veiculo_id } = req.body;
  if (!descricao || !data_agendamento || !veiculo_id) {
    return res.status(400).json({ erro: 'Descrição, data e veículo são obrigatórios' });
  }
  try {
    const id = await ordemServicoService.criar({ descricao, data_agendamento, veiculo_id });
    res.status(201).json({ id });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ erro: 'Veículo informado não existe' });
    }
    res.status(500).json({ erro: 'Erro ao cadastrar ordem de serviço' });
  }
}

async function atualizarData(req, res) {
  const { data_agendamento } = req.body;
  if (!data_agendamento) {
    return res.status(400).json({ erro: 'Informe a nova data' });
  }
  try {
    const linhas = await ordemServicoService.atualizarData(req.params.id, data_agendamento);
    if (!linhas) return res.status(404).json({ erro: 'Ordem de serviço não encontrada' });
    res.json({ mensagem: 'Data atualizada' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar data' });
  }
}

module.exports = { listar, criar, atualizarData };