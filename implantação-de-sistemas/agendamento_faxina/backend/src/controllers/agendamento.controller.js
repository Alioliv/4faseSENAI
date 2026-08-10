import agendamentoService from '../services/agendamento.service.js'


export async function listar(req, res, next) {
  try {
    const { termo, ordenar } = req.query

    if (termo) {
      return 
      res.json(await agendamentoService.buscarAgendamento(termo))
    }
    if (ordenar) {
      return 
      res.json(await agendamentoService.listarOrdenados(ordenar))
    }
    res.json(await agendamentoService.listarAgendamento())
  } catch (err) {
    next(err)
  }
}


export async function proximos(req, res, next) {
  try {
    res.json(await agendamentoService.proximosAgendamento())
  } catch (err) {
    next(err)
  }
}

export async function buscarPorId(req, res, next) {
  try {
    res.json(await agendamentoService.buscarAgendamentoPorId(Number(req.params.id)))
  } catch (err) {
    next(err)
  }
}

export async function criar(req, res, next) {
  try {
    const agendamento = await agendamentoService.criarAgendamento(req.body)
    res.status(201).json(agendamento)
  } catch (err) {
    next(err)
  }
}

export async function editar(req, res, next) {
  try {
    res.json(await agendamentoService.editarAgendamento(Number(req.params.id), req.body))
  } catch (err) {
    next(err)
  }
}

export async function excluir(req, res, next) {
  try {
    await agendamentoService.excluirAgendamento(Number(req.params.id))
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
