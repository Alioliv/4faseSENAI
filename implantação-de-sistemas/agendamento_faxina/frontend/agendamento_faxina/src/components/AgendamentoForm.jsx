import { useEffect, useState } from 'react'
import { listarClientes, listarProfissionais } from '../services/agendamentoService'

const VAZIO = {
  clienteNome: '',
  clienteTelefone: '',
  clienteEndereco: '',
  profissionalNome: '',
  profissionalTelefone: '',
  tipo_servico: '',
  data_agendamento: '',
  horario: '',
  status: 'pendente',
  observacoes: ''
}

export default function AgendamentoForm({ agendamentoEmEdicao, onSalvar, onCancelar }) {
  const [dados, setDados] = useState(VAZIO)
  const [clientesExistentes, setClientesExistentes] = useState([])
  const [profissionaisExistentes, setProfissionaisExistentes] = useState([])


  useEffect(() => {
    async function carregarSugestoes() {
      const [clientes, profissionais] = await Promise.all([
        listarClientes(),
        listarProfissionais()
      ])
      setClientesExistentes(clientes)
      setProfissionaisExistentes(profissionais)
    }
    carregarSugestoes()
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
        Nome do cliente
        <input
          type="text"
          list="clientes-existentes"
          value={dados.clienteNome}
          onChange={(e) => setDados((d) => ({ ...d, clienteNome: e.target.value }))}
          placeholder="Ex: Maria Souza"
          required
        />
        <datalist id="clientes-existentes">
          {clientesExistentes.map((c) => (
            <option key={c.id_cliente} value={c.nome} />
          ))}
        </datalist>
      </label>

      <label>
        Telefone do cliente
        <input
          type="text"
          value={dados.clienteTelefone}
          onChange={(e) => setDados((d) => ({ ...d, clienteTelefone: e.target.value }))}
          placeholder="(47) 99999-0000"
          required
        />
      </label>

      <label className="obs-field">
        Endereço do cliente
        <input
          type="text"
          value={dados.clienteEndereco}
          onChange={(e) => setDados((d) => ({ ...d, clienteEndereco: e.target.value }))}
          placeholder="Rua das Flores, 123 - Joinville/SC"
          required
        />
      </label>

      <label>
        Nome do profissional
        <input
          type="text"
          list="profissionais-existentes"
          value={dados.profissionalNome}
          onChange={(e) => setDados((d) => ({ ...d, profissionalNome: e.target.value }))}
          placeholder="Ex: Ana Ferreira"
          required
        />
        <datalist id="profissionais-existentes">
          {profissionaisExistentes.map((p) => (
            <option key={p.id_profissional} value={p.nome} />
          ))}
        </datalist>
      </label>

      <label>
        Telefone do profissional
        <input
          type="text"
          value={dados.profissionalTelefone}
          onChange={(e) => setDados((d) => ({ ...d, profissionalTelefone: e.target.value }))}
          placeholder="(47) 98888-0000"
          required
        />
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