import * as authService from '../services/auth.service.js'

export async function cadastrar(req, res, next) {
  try {
    const resultado = await authService.cadastrarUsuario(req.body)
    res.status(201).json(resultado)
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const resultado = await authService.loginUsuario(req.body)
    res.json(resultado)
  } catch (err) {
    next(err)
  }
}
