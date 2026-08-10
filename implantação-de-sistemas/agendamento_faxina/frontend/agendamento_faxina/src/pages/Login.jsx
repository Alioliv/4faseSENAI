import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { usuario, entrar } = useAuth()
  const navigate = useNavigate()
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  if (usuario) return <Navigate to="/" replace />

  function handleSubmit(e) {
    e.preventDefault()
    try {
      entrar(login, senha)
      navigate('/')
    } catch (err) {
      setErro(err.message)
    }
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {erro && <p className="alert-error">{erro}</p>}
        <label>
          Usuário
          <input value={login} onChange={(e) => setLogin(e.target.value)} required />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </label>
        <button type="submit">Entrar</button>
        <p className="login-hint">Usuário de teste: admin / 1234</p>
      </form>
    </div>
  )
}
