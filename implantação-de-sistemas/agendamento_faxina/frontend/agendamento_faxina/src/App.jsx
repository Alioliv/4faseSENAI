import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Principal from './pages/Principal'
import CadastroAgendamento from './pages/CadastroAgendamento'
import GestaoAgendamentos from './pages/GestaoAgendamentos'
import CadastroUsuario from './pages/CadastroUsuario'
import './App.css'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<Principal />} />
            <Route path="/cadastro" element={<CadastroAgendamento />} />
            <Route path="/gestao" element={<GestaoAgendamentos />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

