import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export default function Principal() {
  const [nome, setNome] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api
      .get<{ nome: string }>('/auth/me')
      .then((d) => setNome(d.nome))
      .catch(() => navigate('/login'))
  }, [navigate])

  async function sair() {
    await api.post('/auth/logout')
    navigate('/login')
  }

  return (
    <main>
      <header>
        <span>Olá, {nome}</span>
        <button onClick={sair}>Sair</button>
      </header>
      <h1>Clínica Veterinária</h1>
      <nav>
        <Link to="/tutores">Tutores</Link>{' '}
        <Link to="/pets">Pets</Link>{' '}
        <Link to="/agendamentos">Agendamentos</Link>
      </nav>
    </main>
  )
}