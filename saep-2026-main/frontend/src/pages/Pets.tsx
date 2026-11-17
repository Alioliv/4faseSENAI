import { useEffect, useState, type SyntheticEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'

type Pet = {
  id: number
  nome: string
  especie: string
  raca: string | null
  data_nascimento: string | null
  tutor_id: number
  tutor_nome: string
}

type Tutor = { id: number; nome: string }

const vazio = { nome: '', especie: '', raca: '', data_nascimento: '', tutor_id: '' }

export default function Pets() {
  const [pets, setPets] = useState<Pet[]>([])
  const [tutores, setTutores] = useState<Tutor[]>([])
  const [form, setForm] = useState(vazio)
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
      setPets(await api.get<Pet[]>('/pets'))
      setTutores(await api.get<Tutor[]>('/tutores'))
    } catch (e) {
      tratarErro(e)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  async function salvar(e: SyntheticEvent) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    try {
      await api.post('/pets', { ...form, tutor_id: Number(form.tutor_id) || null })
      setSucesso('Pet cadastrado com sucesso!')
      setForm(vazio)
      carregar()
    } catch (e) {
      tratarErro(e)
    }
  }

  const formatarData = (d: string | null) =>
    d ? d.split('-').reverse().join('/') : ''

  return (
    <main>
      <Link to="/">← Voltar</Link>
      <h1>Pets</h1>

      {erro && <p className="erro">{erro}</p>}
      {sucesso && <p>{sucesso}</p>}

      <table>
        <thead>
          <tr>
            <th>Nome</th><th>Espécie</th><th>Raça</th><th>Nascimento</th><th>Tutor</th>
          </tr>
        </thead>
        <tbody>
          {pets.map((p) => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>{p.especie}</td>
              <td>{p.raca}</td>
              <td>{formatarData(p.data_nascimento)}</td>
              <td>{p.tutor_nome}</td>
            </tr>
          ))}
          {pets.length === 0 && (
            <tr><td colSpan={5}>Nenhum pet cadastrado.</td></tr>
          )}
        </tbody>
      </table>

      <h2>Novo pet</h2>
      <form onSubmit={salvar}>
        <input placeholder="Nome" value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })} />
        <input placeholder="Espécie (ex.: Cachorro)" value={form.especie}
          onChange={(e) => setForm({ ...form, especie: e.target.value })} />
        <input placeholder="Raça" value={form.raca}
          onChange={(e) => setForm({ ...form, raca: e.target.value })} />
        <input type="date" value={form.data_nascimento}
          onChange={(e) => setForm({ ...form, data_nascimento: e.target.value })} />
        <select value={form.tutor_id}
          onChange={(e) => setForm({ ...form, tutor_id: e.target.value })}>
          <option value="">Selecione o tutor</option>
          {tutores.map((t) => (
            <option key={t.id} value={t.id}>{t.nome}</option>
          ))}
        </select>
        <button type="submit">Cadastrar</button>
      </form>
    </main>
  )
}