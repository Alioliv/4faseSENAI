import { useEffect, useState } from 'react'
import { listarClientes, listarProfissionais } from '../services/agendamentoService'

const VAZIO = {
  id_cliente: '',
  id_profissional: '',
  tipo_servico: '',
  data_agendamento: '',
  horario: '',
  status: 'pendente',
  observacoes: ''
}

export default function AgendamentoForm({ agendamentoEmEdicao, onSalvar, onCancelar }) {
  const [dados, setDados] = useState(VAZIO)
  const [clientes, setClientes] = useState([])
  const [profissionais, setProfissionais] = useState([])

  useEffect(() => {
    setClientes(listarClientes())
    setProfissionais(listarProfissionais())
  }, [])

  useEffect(() => {
    setDados(agendamentoEmEdicao ? { ...VAZIO, ...agendamentoEmEdicao } : VAZIO)
  }, [agendamentoEmEdicao])

  function handleSubmit(e) {
    e.preventDefault()
    onSalvar(dados)
    setDados(VAZIO)
  }

  return (
    <form className="agendamento-form" onSubmit={handleSubmit}>
      <label>
        Cliente
        <select
          value={dados.id_cliente}
          onChange={(e) => setDados((d) => ({ ...d, id_cliente: e.target.value }))}
          required
        >
          <option value="">Selecione</option>
          {clientes.map((c) => (
            <option key={c.id_cliente} value={c.id_cliente}>{c.nome} ({c.tipo_cliente})</option>
          ))}
        </select>
      </label>

      <label>
        Profissional
        <select
          value={dados.id_profissional}
          onChange={(e) => setDados((d) => ({ ...d, id_profissional: e.target.value }))}
          required
        >
          <option value="">Selecione</option>
          {profissionais.map((p) => (
            <option key={p.id_profissional} value={p.id_profissional}>
              {p.nome} ({p.especialidade}){!p.disponivel ? ' - indisponível' : ''}
            </option>
          ))}
        </select>
      </label>

      <label>
        Tipo de serviço
        <select
          value={dados.tipo_servico}
          onChange={(e) => setDados((d) => ({ ...d, tipo_servico: e.target.value }))}
          required
        >
          <option value="">Selecione</option>
          <option value="residencial">Residencial</option>
          <option value="comercial">Comercial</option>
        </select>
      </label>

      <label>
        Data
        <input
          type="date"
          value={dados.data_agendamento}
          onChange={(e) => setDados((d) => ({ ...d, data_agendamento: e.target.value }))}
          required
        />
      </label>

      <label>
        Horário
        <input
          type="time"
          value={dados.horario}
          onChange={(e) => setDados((d) => ({ ...d, horario: e.target.value }))}
          required
        />
      </label>

      <label>
        Status
        <select
          value={dados.status}
          onChange={(e) => setDados((d) => ({ ...d, status: e.target.value }))}
        >
          <option value="pendente">Pendente</option>
          <option value="confirmado">Confirmado</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </label>

      <label className="obs-field">
        Observações
        <input
          type="text"
          maxLength={255}
          value={dados.observacoes || ''}
          onChange={(e) => setDados((d) => ({ ...d, observacoes: e.target.value }))}
        />
      </label>

      <div className="form-actions">
        <button type="submit">{agendamentoEmEdicao ? 'Salvar alterações' : 'Cadastrar'}</button>
        {agendamentoEmEdicao && (
          <button type="button" onClick={onCancelar}>Cancelar</button>
        )}
      </div>
    </form>
  )
}
