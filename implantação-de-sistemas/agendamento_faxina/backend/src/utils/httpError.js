// Erro customizado usado pelos services para sinalizar falhas de
// negócio (validação, conflito, não encontrado) com o status HTTP
// já embutido. O errorHandler sabe reconhecer essa classe e devolver
// a resposta certa pro front.
export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}
