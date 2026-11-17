import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Principal from './pages/Principal'
import Tutores from './pages/Tutores'
import Pets from './pages/Pets'
import Agendamentos from './pages/Agendamentos'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Principal />} />
        <Route path="/tutores" element={<Tutores />} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/agendamentos" element={<Agendamentos />} />
      </Routes>
    </BrowserRouter>
  )
}
