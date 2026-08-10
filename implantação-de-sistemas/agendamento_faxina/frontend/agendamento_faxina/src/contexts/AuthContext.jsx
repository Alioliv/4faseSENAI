import { createContext, useContext, useState } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(authService.getUsuarioLogado())

  function entrar(login, senha) {
    const logado = authService.login(login, senha)
    setUsuario(logado)
    return logado
  }

  function sair() {
    authService.logout()
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}