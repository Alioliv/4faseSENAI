import * as profissionalService from '../services/profissional.service.js'

export async function listar(req, res, next) {
  try {
    res.json(await profissionalService.listarProfissionais())
  } catch (err) {
    next(err)
  }
}

export async function buscarPorId(req, res, next) {
  try {
    res.json(await profissionalService.buscarProfissionalPorId(Number(req.params.id)))
  } catch (err) {
    next(err)
  }
}

export async function criar(req, res, next) {
  try {
    const profissional = await profissionalService.criarProfissional(req.body)
    res.status(201).json(profissional)
  } catch (err) {
    next(err)
  }
}

export async function editar(req, res, next) {
  try {
    res.json(await profissionalService.editarProfissional(Number(req.params.id), req.body))
  } catch (err) {
    next(err)
  }
}

export async function excluir(req, res, next) {
  try {
    await profissionalService.excluirProfissional(Number(req.params.id))
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
