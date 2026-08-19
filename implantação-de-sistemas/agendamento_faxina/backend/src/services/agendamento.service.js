
import prisma from '../config/prismaClient.js'
import { HttpError } from '../utils/httpError.js'

const INCLUDE_NOMES = {
  cliente: { select: { nome: true, telefone: true, endereco: true } },
  profissional: { select: { nome: true, telefone: true } }
}

// Procura 
async function resolverCliente(nome, telefone, endereco, tipo_servico) {
  const existente = await prisma.cliente.findFirst({ where: { nome } })
  if (existente) return existente

  return prisma.cliente.create({
    data: {
      nome,
      telefone: telefone || 'não informado',
      endereco: endereco || 'não informado',
      tipo_cliente: tipo_servico
    }
  })
}


// preenchida a partir do tipo_servico do agendamento
async function resolverProfissional(nome, telefone, tipo_servico) {
  const existente = await prisma.profissional.findFirst({ where: { nome } })
  if (existente) return existente

  return prisma.profissional.create({
    data: {
      nome,
      telefone: telefone || 'não informado',
      especialidade: tipo_servico,
      disponivel: true
    }
  })
}

// listagem 
export async function listarAgendamentos() {
  return prisma.agendamento.findMany({ include: INCLUDE_NOMES })
}

//  busca por termo
export async function buscarAgendamentos(termo) {
  if (!termo) return listarAgendamentos()

  return prisma.agendamento.findMany({
    where: {
      OR: [
        { cliente: { nome: { contains: termo } } },
        { profissional: { nome: { contains: termo } } },
        { tipo_servico: { equals: termo } },
        { status: { equals: termo } }
      ]
    },
    include: INCLUDE_NOMES
  })
}


export async function listarOrdenados(criterio = 'data') {
  if (criterio === 'alfabetica') {
    return prisma.agendamento.findMany({
      include: INCLUDE_NOMES,
      orderBy: { cliente: { nome: 'asc' } }
    })
  }
  return prisma.agendamento.findMany({
    include: INCLUDE_NOMES,
    orderBy: [{ data_agendamento: 'asc' }, { horario: 'asc' }]
  })
}

export async function buscarAgendamentoPorId(id_agendamento) {
  const agendamento = await prisma.agendamento.findUnique({
    where: { id_agendamento },
    include: INCLUDE_NOMES
  })
  if (!agendamento) throw new HttpError(404, 'Agendamento não encontrado.')
  return agendamento
}


async function verificarConflito({ id_profissional, data_agendamento, horario, ignorarId }) {
  const existente = await prisma.agendamento.findFirst({
    where: {
      id_profissional,
      data_agendamento: new Date(data_agendamento),
      horario: new Date(`1970-01-01T${horario}`),
      ...(ignorarId ? { NOT: { id_agendamento: ignorarId } } : {})
    }
  })
  return Boolean(existente)
}

function validarCamposObrigatorios(dados) {
  const obrigatorios = [
    'clienteNome',
    'clienteTelefone',
    'clienteEndereco',
    'profissionalNome',
    'profissionalTelefone',
    'tipo_servico',
    'data_agendamento',
    'horario'
  ]
  for (const campo of obrigatorios) {
    if (!dados[campo]) {
      throw new HttpError(400, 'Preencha todos os campos obrigatórios do agendamento.')
    }
  }
}


export async function criarAgendamento(dados) {
  validarCamposObrigatorios(dados)

  const cliente = await resolverCliente(dados.clienteNome, dados.clienteTelefone, dados.clienteEndereco, dados.tipo_servico)
  const profissional = await resolverProfissional(dados.profissionalNome, dados.profissionalTelefone, dados.tipo_servico)

  if (await verificarConflito({
    id_profissional: profissional.id_profissional,
    data_agendamento: dados.data_agendamento,
    horario: dados.horario
  })) {
    throw new HttpError(409, 'Conflito de horário: esse profissional já tem agendamento nesse dia e horário.')
  }

  return prisma.agendamento.create({
    data: {
      id_cliente: cliente.id_cliente,
      id_profissional: profissional.id_profissional,
      tipo_servico: dados.tipo_servico,
      data_agendamento: new Date(dados.data_agendamento),
      horario: new Date(`1970-01-01T${dados.horario}`),
      status: dados.status || 'pendente',
      observacoes: dados.observacoes || null
    },
    include: INCLUDE_NOMES
  })
}


export async function editarAgendamento(id_agendamento, dados) {
  const cliente = await resolverCliente
  (dados.clienteNome, dados.clienteTelefone, dados.clienteEndereco, dados.tipo_servico)
  const profissional = await resolverProfissional
  (dados.profissionalNome, dados.profissionalTelefone, dados.tipo_servico)

  if (await verificarConflito({
    id_profissional: profissional.id_profissional,
    data_agendamento: dados.data_agendamento,
    horario: dados.horario,
    ignorarId: id_agendamento
  })) {
    throw new HttpError(409, 'Conflito de horário: esse profissional já tem agendamento nesse dia e horário.')
  }

  return prisma.agendamento.update({
    where: { id_agendamento },
    data: {
      id_cliente: cliente.id_cliente,
      id_profissional: profissional.id_profissional,
      tipo_servico: dados.tipo_servico,
      data_agendamento: new Date(dados.data_agendamento),
      horario: new Date(`1970-01-01T${dados.horario}`),
      status: dados.status,
      observacoes: dados.observacoes || null
    },
    include: INCLUDE_NOMES
  })
}

export async function excluirAgendamento(id_agendamento) {
  await prisma.agendamento.delete({ where: { id_agendamento } })
}

export async function proximosAgendamentos() {
  const agora = new Date()
  const limite = new Date(agora.getTime() + 24 * 60 * 60 * 1000)

  const candidatos = await prisma.agendamento.findMany({
    where: {
      data_agendamento: {
        gte: new Date(agora.toDateString()),
        lte: limite
      }
    },
    include: INCLUDE_NOMES
  })

  return candidatos.filter((a) => {
    const horaStr = a.horario.toISOString().slice(11, 19)
    const dataHora = new Date(`${a.data_agendamento.toISOString().slice(0, 10)}T${horaStr}`)
    return dataHora >= agora && dataHora <= limite
  })
}