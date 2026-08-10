import { Link, Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function MainLayout() {
  const { usuario, sair } = useAuth()

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Sistema de Agendamento de Faxinas</h1>
        <nav>
          <Link to="/">Início</Link>
          <Link to="/cadastro">Cadastro de Agendamento</Link>
          <Link to="/gestao">Gestão de Agendamentos</Link>
        </nav>
        <div className="app-user">
          <span>Olá, {usuario.nome}</span>
          <button onClick={sair}>Sair</button>
        </div>
      </header>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  )
}
