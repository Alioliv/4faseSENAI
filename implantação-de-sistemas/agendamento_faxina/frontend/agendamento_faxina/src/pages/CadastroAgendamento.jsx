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
  const [carregando, setCarregando] = useState(true)

  async function recarregar() {
    setCarregando(true)
    try {
      const lista = termo ? await buscarAgendamentos(termo) : await listarAgendamentos()
      setAgendamentos(lista)
    } catch {
      setErro('Não foi possível carregar')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    recarregar()
  }, [termo])

  async function handleSalvar(dados) {
    setErro('')
    try {
      if (emEdicao) {
        await editarAgendamento(emEdicao.id_agendamento, dados)
        setEmEdicao(null)
      } else {
        await criarAgendamento(dados)
      }
      await recarregar()
    } catch (err) {
      setErro(err.message)
    }
  }

  async function handleExcluir(id) {
    setErro('')
    try {
      await excluirAgendamento(id)
      await recarregar()
    } catch (err) {
      setErro(err.message)
    }
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

      {carregando ? (
        <p className="empty-state">Carregando...</p>
      ) : (
        <AgendamentoTable
          agendamentos={agendamentos}
          onEditar={setEmEdicao}
          onExcluir={handleExcluir}
        />
      )}
    </div>
  )
}