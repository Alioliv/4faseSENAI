import { useState, type SyntheticEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  async function entrar(e: SyntheticEvent) {
    e.preventDefault()
    setErro('')
    try {
      await api.post('/auth/login', { email, senha })
      navigate('/')
    } catch (err) {
      setErro((err as Error).message)
    }
  }

  return (
    <main>
      <h1>Clínica Veterinária</h1>
      <form onSubmit={entrar}>
        <label>E-mail</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Senha</label>
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
        {erro && <p className="erro">{erro}</p>}
        <button type="submit">Entrar</button>
      </form>
    </main>
  )
}

