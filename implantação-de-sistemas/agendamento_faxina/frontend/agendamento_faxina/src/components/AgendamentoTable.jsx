const STATUS_LABEL = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  concluido: 'Concluído',
  cancelado: 'Cancelado'
}

export default function AgendamentoTable({ agendamentos, onEditar, onExcluir }) {
  if (agendamentos.length === 0) {
    return <p className="empty-state">Nenhum agendamento encontrado.</p>
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Profissional</th>
          <th>Tipo</th>
          <th>Data</th>
          <th>Horário</th>
          <th>Status</th>
          <th>Ações</th>
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
            <td>
              <span className={`status-badge status-${a.status}`}>
                {STATUS_LABEL[a.status] || a.status}
              </span>
            </td>
            <td className="table-actions">
              <button onClick={() => onEditar(a)}>Editar</button>
              <button onClick={() => onExcluir(a.id_agendamento)}>Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
