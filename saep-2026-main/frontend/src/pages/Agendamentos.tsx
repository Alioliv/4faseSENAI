import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'

type Agendamento = {
  id: number
  data_agendamento: string
  motivo: string
  status: string
  pet_nome: string
  pet_especie: string
  pet_raca: string | null
  pet_nascimento: string | null
  tutor_nome: string
  tutor_cpf: string
  tutor_telefone: string
  tutor_email: string | null
  tutor_endereco: string | null
}

export default function Agendamentos() {
  const [lista, setLista] = useState<Agendamento[]>([])
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [novaData, setNovaData] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const navigate = useNavigate()

  function tratarErro(e: unknown) {
    const msg = (e as Error).message
    if (msg.includes('autenticado') || msg.includes('expirada')) navigate('/login')
    setErro(msg)
  }

  async function carregar() {
    try {
      setLista(await api.get<Agendamento[]>('/agendamentos'))
    } catch (e) {
      tratarErro(e)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  function editar(a: Agendamento) {
    setEditandoId(a.id)
    setNovaData(a.data_agendamento) // já vem no formato do datetime-local
    setErro('')
    setSucesso('')
  }

  async function salvar() {
    setErro('')
    setSucesso('')
    try {
      await api.put(`/agendamentos/${editandoId}`, { data_agendamento: novaData })
      setSucesso('Data atualizada com sucesso!')
      setEditandoId(null)
      carregar()
    } catch (e) {
      tratarErro(e)
    }
  }

  const formatarDataHora = (d: string) => {
    const [data, hora] = d.split('T')
    return `${data.split('-').reverse().join('/')} ${hora}`
  }
  const formatarData = (d: string | null) => (d ? d.split('-').reverse().join('/') : '')
  const mascarar = (cpf: string) => `***.***.***-${cpf.slice(9)}`

  return (
    <main>
      <Link to="/">← Voltar</Link>
      <h1>Agendamentos</h1>

      {erro && <p className="erro">{erro}</p>}
      {sucesso && <p>{sucesso}</p>}

      <table>
        <thead>
          <tr>
            <th>Data/hora</th><th>Motivo</th><th>Status</th>
            <th>Pet</th><th>Espécie</th><th>Raça</th><th>Nascimento</th>
            <th>Tutor</th><th>CPF</th><th>Telefone</th><th>E-mail</th><th>Endereço</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lista.map((a) => (
            <tr key={a.id}>
              <td>
                {editandoId === a.id ? (
                  <input
                    type="datetime-local"
                    value={novaData}
                    onChange={(e) => setNovaData(e.target.value)}
                  />
                ) : (
                  formatarDataHora(a.data_agendamento)
                )}
              </td>
              <td>{a.motivo}</td>
              <td>{a.status}</td>
              <td>{a.pet_nome}</td>
              <td>{a.pet_especie}</td>
              <td>{a.pet_raca}</td>
              <td>{formatarData(a.pet_nascimento)}</td>
              <td>{a.tutor_nome}</td>
              <td>{mascarar(a.tutor_cpf)}</td>
              <td>{a.tutor_telefone}</td>
              <td>{a.tutor_email}</td>
              <td>{a.tutor_endereco}</td>
              <td>
                {editandoId === a.id ? (
                  <>
                    <button onClick={salvar}>Salvar</button>{' '}
                    <button onClick={() => setEditandoId(null)}>Cancelar</button>
                  </>
                ) : (
                  <button onClick={() => editar(a)}>Alterar data</button>
                )}
              </td>
            </tr>
          ))}
          {lista.length === 0 && (
            <tr><td colSpan={13}>Nenhum agendamento cadastrado.</td></tr>
          )}
        </tbody>
      </table>
    </main>
  )
}