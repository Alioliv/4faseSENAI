import { HttpError } from '../utils/httpError.js'

// Middleware final do Express (tem 4 parâmetros, por isso o Express
// sabe que é um error handler). Toda vez que um controller chama
// next(err), a requisição cai aqui.
export function errorHandler(err, req, res, _next) {
  // Erros de negócio que nós mesmos lançamos nos services
  // (ex: RF11 validação, RF16 conflito de horário).
  if (err instanceof HttpError) {
    return res.status(err.status).json({ erro: err.message })
  }

  // Erros do Prisma têm um "code" (ex: P2025 = registro não
  // encontrado, P2002 = violação de unicidade).
  if (err.code === 'P2025') {
    return res.status(404).json({ erro: 'Registro não encontrado.' })
  }
  if (err.code === 'P2002') {
    return res.status(409).json({ erro: 'Já existe um registro com esse valor único.' })
  }

  console.error(err)
  res.status(500).json({ erro: 'Erro interno no servidor.' })
}
