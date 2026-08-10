import { HttpError } from '../utils/httpError.js'

export function errorHandler(err, req, res, next) {

    if (err instanceof HttpError) {
        res.status(err.status).json({
            erro: err.message
        })
    } else if (err.code === 'P2025') {
        res.status(404).json({
            erro: 'Registro não encontrado.'
        })
    } else if (err.code === 'P2002') {
        res.status(409).json({
            erro: 'Já existe um registro com esse valor único.'
        })
    } else {
        console.error(err)

        res.status(500).json({
            erro: 'Erro interno no servidor.'
        })
    }
}


