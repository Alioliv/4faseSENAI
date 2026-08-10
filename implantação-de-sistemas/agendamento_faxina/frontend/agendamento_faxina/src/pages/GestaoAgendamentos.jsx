import { useEffect, useState } from 'react'
import { ordenarAgendamentos, atividadeRecente } from '../services/agendamentoService'

const STATUS_LABEL = {
  pendente: 'Pendente',
  concluido: 'Concluído',
  cancelado: 'Cancelado'
}

export default function GestaoAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([])
  const [criterio, setCriterio] = useState('data')
  const [recentes, setRecentes] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      setCarregando(true)
      const [lista, recentesLista] = await Promise.all([
        ordenarAgendamentos(null, criterio),
        atividadeRecente()
      ])
      setAgendamentos(lista)
      setRecentes(recentesLista)
      setCarregando(false)
    }
    carregar()
  }, [criterio])

  return (
    <div>
      <h2>Gestão de Agendamentos</h2>

      <label className="ordenar-select">
        Ordenar por:
        <select value={criterio} onChange={(e) => setCriterio(e.target.value)}>
          <option value="data">Data/horário (cronológica)</option>
          <option value="alfabetica">Cliente (alfabética)</option>
        </select>
      </label>

      {carregando ? (
        <p className="empty-state">Carregando...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Profissional</th>
              <th>Tipo</th>
              <th>Data</th>
              <th>Horário</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.map((a) => (
              <tr key={a.id_agendamento}>
                <td>{a.clienteNome}</td>
                <td>{a.profissionalNome}</td>
                <td>{a.tipo_servico}</td>
                <td>{a.data_agendamento}</td>
                <td>{a.horario}</td>
                <td>{STATUS_LABEL[a.status] || a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Atividade recentes</h3>
      <ul className="historico-list">
        {recentes.map((a) => (
          <li key={a.id_agendamento}>
            [{STATUS_LABEL[a.status] || a.status}] {a.clienteNome} — {a.profissionalNome} em{' '}
            {a.data_agendamento} às {a.horario}
          </li>
        ))}
      </ul>
    </div>
  )
}
