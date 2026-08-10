import { KEYS } from './seedData'

function readAll() {
  return JSON.parse(localStorage.getItem(KEYS.agendamentos) || '[]')
}

function writeAll(lista) {
  localStorage.setItem(KEYS.agendamentos, JSON.stringify(lista))
}

function readClientes() {
  return JSON.parse(localStorage.getItem(KEYS.clientes) || '[]')
}

function readProfissionais() {
  return JSON.parse(localStorage.getItem(KEYS.profissionais) || '[]')
}

function nomeCliente(id_cliente) {
  return readClientes().find((c) => c.id_cliente === id_cliente)?.nome || ''
}

function nomeProfissional(id_profissional) {
  return readProfissionais().find((p) => p.id_profissional === id_profissional)?.nome || ''
}

// Junta o agendamento com nome do cliente/profissional pra exibir na tela,
// sem duplicar esses dados no registro (mesma normalização do banco).
function comNomes(agendamento) {
  return {
    ...agendamento,
    clienteNome: nomeCliente(agendamento.id_cliente),
    profissionalNome: nomeProfissional(agendamento.id_profissional)
  }
}

// RF06: listagem completa
export function listarAgendamentos() {
  return readAll().map(comNomes)
}

// RF07: busca por termo (cliente, profissional, tipo ou status)
export function buscarAgendamentos(termo) {
  const lista = listarAgendamentos()
  if (!termo) return lista
  const t = termo.toLowerCase()
  return lista.filter(
    (a) =>
      a.clienteNome.toLowerCase().includes(t) ||
      a.profissionalNome.toLowerCase().includes(t) ||
      a.tipo_servico.toLowerCase().includes(t) ||
      a.status.toLowerCase().includes(t)
  )
}

// RF16: mesma regra da constraint uq_profissional_data_horario do banco
export function verificarConflito({ id_profissional, data_agendamento, horario, ignorarId }) {
  const lista = readAll()
  return lista.some(
    (a) =>
      a.id_profissional === Number(id_profissional) &&
      a.data_agendamento === data_agendamento &&
      a.horario === horario &&
      a.id_agendamento !== ignorarId
  )
}

// RF08 + RF11: inserção com validação básica de campos obrigatórios
export function criarAgendamento(dados) {
  const obrigatorios = ['id_cliente', 'id_profissional', 'tipo_servico', 'data_agendamento', 'horario']
  for (const campo of obrigatorios) {
    if (!dados[campo]) {
      throw new Error('Preencha todos os campos obrigatórios do agendamento.')
    }
  }

  if (verificarConflito(dados)) {
    throw new Error('Conflito de horário: profissional já alocado nesse dia/horário.')
  }

  const lista = readAll()
  const proximoId = lista.length ? Math.max(...lista.map((a) => a.id_agendamento)) + 1 : 1
  const novo = {
    id_agendamento: proximoId,
    id_cliente: Number(dados.id_cliente),
    id_profissional: Number(dados.id_profissional),
    tipo_servico: dados.tipo_servico,
    data_agendamento: dados.data_agendamento,
    horario: dados.horario,
    status: dados.status || 'pendente',
    observacoes: dados.observacoes || null,
    criado_em: new Date().toISOString()
  }
  lista.push(novo)
  writeAll(lista)
  return comNomes(novo)
}

// RF09: edição
export function editarAgendamento(id_agendamento, dados) {
  if (verificarConflito({ ...dados, ignorarId: id_agendamento })) {
    throw new Error('Conflito de horário: profissional já alocado nesse dia/horário.')
  }
  const lista = readAll()
  const idx = lista.findIndex((a) => a.id_agendamento === id_agendamento)
  if (idx === -1) throw new Error('Agendamento não encontrado.')
  lista[idx] = {
    ...lista[idx],
    ...dados,
    id_cliente: Number(dados.id_cliente),
    id_profissional: Number(dados.id_profissional)
  }
  writeAll(lista)
  return comNomes(lista[idx])
}

// RF10: exclusão
export function excluirAgendamento(id_agendamento) {
  const lista = readAll()
  const restante = lista.filter((a) => a.id_agendamento !== id_agendamento)
  writeAll(restante)
}

// RF13: ordenação alfabética (cliente) ou cronológica (data/horário)
export function ordenarAgendamentos(lista, criterio = 'data') {
  const copia = [...lista]
  if (criterio === 'alfabetica') {
    return copia.sort((a, b) => a.clienteNome.localeCompare(b.clienteNome))
  }
  return copia.sort((a, b) =>
    `${a.data_agendamento}${a.horario}`.localeCompare(`${b.data_agendamento}${b.horario}`)
  )
}

// RF18: alerta simples para agendamentos nas próximas 24h
export function proximosAgendamentos() {
  const agora = new Date()
  const limite = new Date(agora.getTime() + 24 * 60 * 60 * 1000)
  return listarAgendamentos().filter((a) => {
    const dataHora = new Date(`${a.data_agendamento}T${a.horario}`)
    return dataHora >= agora && dataHora <= limite
  })
}

// RF17: como não há tabela Historico no banco, a "trilha" é derivada
// do próprio campo criado_em de Agendamento (mais recentes primeiro).
export function atividadeRecente() {
  return listarAgendamentos()
    .slice()
    .sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em))
}

export function listarClientes() {
  return readClientes()
}

export function listarProfissionais() {
  return readProfissionais()
}
