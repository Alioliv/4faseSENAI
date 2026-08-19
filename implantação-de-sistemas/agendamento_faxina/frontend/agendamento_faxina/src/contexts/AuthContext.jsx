import { createContext, useContext, useState } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(authService.getUsuarioLogado())

  async function entrar(login, senha) {
    const logado = await authService.login(login, senha)
    setUsuario(logado)
    return logado
  }

  async function cadastrar(nome, login, senha) {
    const criado = await authService.cadastrar(nome, login, senha)
    setUsuario(criado)
    return criado
  }

  function sair() {
    authService.logout()
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, entrar, cadastrar, sair }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}