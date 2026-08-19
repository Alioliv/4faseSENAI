
import api from '../api/axiosConfig'

function extrairData(dataHora) {
    if (dataHora) {
        return dataHora.slice(0, 10)
    } else { return ''}
}

function extrairHorario(dataHora) {
    if (dataHora) {
        return dataHora.slice(11, 16)
    } else { return ''}
}



function normalizar(dados) {
  return {
    id_agendamento: dados.id_agendamento,
    id_cliente: dados.id_cliente,
    id_profissional: dados.id_profissional,
    tipo_servico: dados.tipo_servico,
    data_agendamento: extrairData(dados.data_agendamento),
    horario: extrairHorario(dados.horario),
    status: dados.status,
    observacoes: dados.observacoes,
    criado_em: dados.criado_em,
    clienteNome: dados.cliente?.nome || '',
    clienteTelefone: dados.cliente?.telefone || '',
    clienteEndereco: dados.cliente?.endereco || '',
    profissionalNome: dados.profissional?.nome || '',
    profissionalTelefone: dados.profissional?.telefone || ''
  }
}

function mensagemErro(err, fallback) {
  return err.response?.data?.erro || fallback
}

export async function listarClientes() {
  const { data } = await api.get('/clientes')
  return data
}

export async function listarProfissionais() {
  const { data } = await api.get('/profissionais')
  return data
}


export async function listarAgendamentos() {
  const { data } = await api.get('/agendamentos')
  return data.map(normalizar)
}


export async function buscarAgendamentos(termo) {
  if (!termo) return listarAgendamentos()
  const { data } = await api.get('/agendamentos', { params: { termo } })
  return data.map(normalizar)
}


export async function ordenarAgendamentos(_listaIgnorada, criterio = 'data') {
  const { data } = await api.get('/agendamentos', { params: { ordenar: criterio } })
  return data.map(normalizar)
}


export async function criarAgendamento(dados) {
  try {
    const { data } = await api.post('/agendamentos', dados)
    return normalizar(data)
  } catch (err) {
    throw new Error(mensagemErro(err, 'Erro ao criar agendamento.'))
  }
}


export async function editarAgendamento(id_agendamento, dados) {
  try {
    const { data } = await api.put(`/agendamentos/${id_agendamento}`, dados)
    return normalizar(data)
  } catch (err) {
    throw new Error(mensagemErro(err, 'Erro ao editar agendamento.'))
  }
}


export async function excluirAgendamento(id_agendamento) {
  try {
    await api.delete(`/agendamentos/${id_agendamento}`)
  } catch (err) {
    throw new Error(mensagemErro(err, 'Erro ao excluir agendamento.'))
  }
}


export async function proximosAgendamentos() {
  const { data } = await api.get('/agendamentos/proximos')
  return data.map(normalizar)
}


export async function atividadeRecente() {
  const lista = await listarAgendamentos()
  return lista.slice().sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em))
}