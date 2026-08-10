
import { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar'
import AgendamentoTable from '../components/AgendamentoTable'
import AgendamentoForm from '../components/AgendamentoForm'
import {
  listarAgendamentos,
  buscarAgendamentos,
  criarAgendamento,
  editarAgendamento,
  excluirAgendamento
} from '../services/agendamentoService'

export default function CadastroAgendamento() {
  const [agendamentos, setAgendamentos] = useState([])
  const [termo, setTermo] = useState('')
  const [emEdicao, setEmEdicao] = useState(null)
  const [erro, setErro] = useState('')

  function recarregar() {
    setAgendamentos(termo ? buscarAgendamentos(termo) : listarAgendamentos())
  }

  useEffect(recarregar, [termo])

  function handleSalvar(dados) {
    setErro('')
    try {
      if (emEdicao) {
        editarAgendamento(emEdicao.id, dados)
        setEmEdicao(null)
      } else {
        criarAgendamento(dados)
      }
      recarregar()
    } catch (err) {
      setErro(err.message)
    }
  }

  function handleExcluir(id) {
    excluirAgendamento(id)
    recarregar()
  }

  return (
    <div>
      <h2>Cadastro de Agendamento</h2>
      {erro && <p className="alert-error">{erro}</p>}

      <AgendamentoForm
        agendamentoEmEdicao={emEdicao}
        onSalvar={handleSalvar}
        onCancelar={() => setEmEdicao(null)}
      />

      <SearchBar valor={termo} onChange={setTermo} placeholder="Buscar por cliente, profissional ou tipo" />

      <AgendamentoTable
        agendamentos={agendamentos}
        onEditar={setEmEdicao}
        onExcluir={handleExcluir}
      />
    </div>
  )
}
