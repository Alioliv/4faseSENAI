import prisma from '../config/prismaClient.js'
import { HttpError } from '../utils/httpError.js'

export async function listarClientes() {
  return prisma.cliente.findMany({ orderBy: { nome: 'asc' } })
}

export async function buscarClientePorId(id_cliente) {
  const cliente = await prisma.cliente.findUnique({ where: { id_cliente } })
  if (!cliente) throw new HttpError(404, 'Cliente não encontrado.')
  return cliente
}

export async function criarCliente(dados) {
  const { nome, telefone, endereco, tipo_cliente } = dados
  if (!nome || !telefone || !endereco || !tipo_cliente) {
    throw new HttpError(400, 'Preencha todos os campos obrigatórios do cliente.')
  }
  return prisma.cliente.create({ data: { nome, telefone, endereco, tipo_cliente } })
}

export async function editarCliente(id_cliente, dados) {
  return prisma.cliente.update({ where: { id_cliente }, data: dados })
}

export async function excluirCliente(id_cliente) {
  await prisma.cliente.delete({ where: { id_cliente } })
}
