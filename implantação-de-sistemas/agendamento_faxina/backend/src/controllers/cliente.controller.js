import * as clienteService from '../services/cliente.service.js'

export async function listar(req, res, next) {
  try {
    res.json(await clienteService.listarClientes())
  } catch (err) {
    next(err)
  }
}

export async function buscarPorId(req, res, next) {
  try {
    res.json(await clienteService.buscarClientePorId(Number(req.params.id)))
  } catch (err) {
    next(err)
  }
}

export async function criar(req, res, next) {
  try {
    const cliente = await clienteService.criarCliente(req.body)
    res.status(201).json(cliente)
  } catch (err) {
    next(err)
  }
}

export async function editar(req, res, next) {
  try {
    res.json(await clienteService.editarCliente(Number(req.params.id), req.body))
  } catch (err) {
    next(err)
  }
}

export async function excluir(req, res, next) {
  try {
    await clienteService.excluirCliente(Number(req.params.id))
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
