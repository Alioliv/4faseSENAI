import prisma from '../config/prismaClient.js'
import { HttpError } from '../utils/httpError.js'

const INCLUDE_NOMES = {
  cliente: { select: { nome: true } },
  profissional: { select: { nome: true } }
}

// RF06: listagem completa
export async function listarAgendamentos() {
  return prisma.agendamento.findMany({ include: INCLUDE_NOMES })
}

// RF07: busca por termo (cliente, profissional, tipo ou status)
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

// RF13: ordenação alfabética (cliente) ou cronológica (data/horário)
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

// RF16: verifica se já existe outro agendamento para o mesmo
// profissional, na mesma data e horário. ignorarId serve pra edição
// (RF09) — o agendamento não pode "conflitar consigo mesmo".
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
  const obrigatorios = ['id_cliente', 'id_profissional', 'tipo_servico', 'data_agendamento', 'horario']
  for (const campo of obrigatorios) {
    if (!dados[campo]) {
      throw new HttpError(400, 'Preencha todos os campos obrigatórios do agendamento.')
    }
  }
}

// RF08 + RF11: inserção com validação de campos obrigatórios
export async function criarAgendamento(dados) {
  validarCamposObrigatorios(dados)

  if (await verificarConflito(dados)) {
    throw new HttpError(409, 'Conflito de horário: esse profissional já tem agendamento nesse dia e horário.')
  }

  return prisma.agendamento.create({
    data: {
      id_cliente: Number(dados.id_cliente),
      id_profissional: Number(dados.id_profissional),
      tipo_servico: dados.tipo_servico,
      data_agendamento: new Date(dados.data_agendamento),
      horario: new Date(`1970-01-01T${dados.horario}`),
      status: dados.status || 'pendente',
      observacoes: dados.observacoes || null
    },
    include: INCLUDE_NOMES
  })
}

// RF09: edição
export async function editarAgendamento(id_agendamento, dados) {
  if (await verificarConflito({ ...dados, ignorarId: id_agendamento })) {
    throw new HttpError(409, 'Conflito de horário: esse profissional já tem agendamento nesse dia e horário.')
  }

  return prisma.agendamento.update({
    where: { id_agendamento },
    data: {
      ...(dados.id_cliente && { id_cliente: Number(dados.id_cliente) }),
      ...(dados.id_profissional && { id_profissional: Number(dados.id_profissional) }),
      ...(dados.tipo_servico && { tipo_servico: dados.tipo_servico }),
      ...(dados.data_agendamento && { data_agendamento: new Date(dados.data_agendamento) }),
      ...(dados.horario && { horario: new Date(`1970-01-01T${dados.horario}`) }),
      ...(dados.status && { status: dados.status }),
      ...(dados.observacoes !== undefined && { observacoes: dados.observacoes })
    },
    include: INCLUDE_NOMES
  })
}

// RF10: exclusão
export async function excluirAgendamento(id_agendamento) {
  await prisma.agendamento.delete({ where: { id_agendamento } })
}

// RF18: alerta de agendamentos nas próximas 24 horas
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

  // O filtro do Prisma acima já reduz bastante, mas a comparação
  // exata de data + horário é feita aqui em JS, já que MySQL guarda
  // hora e data em colunas separadas.
  return candidatos.filter((a) => {
    const horaStr = a.horario.toISOString().slice(11, 19)
    const dataHora = new Date(`${a.data_agendamento.toISOString().slice(0, 10)}T${horaStr}`)
    return dataHora >= agora && dataHora <= limite
  })
}
