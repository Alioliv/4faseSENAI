import prisma from '../config/prismaClient.js'
import { HttpError } from '../utils/httpError.js'

export async function listarProfissionais() {
  return prisma.profissional.findMany({ orderBy: { nome: 'asc' } })
}

export async function buscarProfissionalPorId(id_profissional) {
  const profissional = await prisma.profissional.findUnique({ where: { id_profissional } })
  if (!profissional) throw new HttpError(404, 'Profissional não encontrado.')
  return profissional
}

export async function criarProfissional(dados) {
  const { nome, telefone, especialidade, disponivel } = dados
  if (!nome || !telefone || !especialidade) {
    throw new HttpError(400, 'Preencha todos os campos obrigatórios do profissional.')
  }
  return prisma.profissional.create({
    data: { nome, telefone, especialidade, disponivel: disponivel ?? true }
  })
}

export async function editarProfissional(id_profissional, dados) {
  return prisma.profissional.update({ where: { id_profissional }, data: dados })
}

export async function excluirProfissional(id_profissional) {
  await prisma.profissional.delete({ where: { id_profissional } })
}
