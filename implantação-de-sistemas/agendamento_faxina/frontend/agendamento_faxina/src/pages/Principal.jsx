import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { proximosAgendamentos } from '../services/agendamentoService'

export default function Principal() {
  const [alertas, setAlertas] = useState([])

  useEffect(() => {
    async function carregar() {
      try {
        setAlertas(await proximosAgendamentos())
      } catch { setAlertas([]) }
    }
    carregar()
  }, [])

  return (
    <div>
      <h2>Painel Principal</h2>

      {alertas.length > 0 && (
        <div className="alert-warning">
          {alertas.length} agendamento(s) nas próximas 24 horas.
        </div>
      )}

      <div className="card-grid">
        <Link className="card-link" to="/cadastro">
          <h3>Cadastro de Agendamento</h3>
          <p>Listar, buscar, inserir, editar e excluir agendamentos.</p>
        </Link>
        <Link className="card-link" to="/gestao">
          <h3>Gestão de Agendamentos</h3>
          <p>Alocar profissionais, definir datas/horários e checar conflitos.</p>
        </Link>
      </div>
    </div>
  )
}