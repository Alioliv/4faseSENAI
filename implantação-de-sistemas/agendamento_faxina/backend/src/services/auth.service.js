import bcrypt from 'bcryptjs'
import prisma from '../config/prismaClient.js'
import { HttpError } from '../utils/httpError.js'

const SALT_ROUNDS = 10

export async function cadastrarUsuario({ nome, usuario, senha }) {
  if (!nome || !usuario || !senha) {
    throw new HttpError(400, 'Preencha nome, usuário e senha.')
  }
  if (senha.length < 4) {
    throw new HttpError(400, 'A senha deve ter no mínimo 4 caracteres.')
  }

  const existente = await prisma.usuario.findUnique({ where: { usuario } })
  if (existente) {
    throw new HttpError(409, 'Esse nome de usuário já está em uso.')
  }

  const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS)

  const novoUsuario = await prisma.usuario.create({
    data: { nome, usuario, senha: senhaHash }
  })

  const { senha: _senha, ...usuarioSemSenha } = novoUsuario
  return usuarioSemSenha
}

export async function loginUsuario({ usuario, senha }) {
  if (!usuario || !senha) {
    throw new HttpError(400, 'Informe usuário e senha.')
  }

  const encontrado = await prisma.usuario.findUnique({ where: { usuario } })
  if (!encontrado) {
    throw new HttpError(401, 'Usuário ou senha inválidos.')
  }

  const senhaCorreta = await bcrypt.compare(senha, encontrado.senha)
  if (!senhaCorreta) {
    throw new HttpError(401, 'Usuário ou senha inválidos.')
  }

  const { senha: _senha, ...usuarioSemSenha } = encontrado
  return usuarioSemSenha
}