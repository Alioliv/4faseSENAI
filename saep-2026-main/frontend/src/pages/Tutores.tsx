import { useEffect, useState, type SyntheticEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'

type Tutor = {
  id: number
  nome: string
  cpf: string
  telefone: string
  email: string | null
  endereco: string | null
}

const vazio = { nome: '', cpf: '', telefone: '', email: '', endereco: '' }

export default function Tutores() {
  const [tutores, setTutores] = useState<Tutor[]>([])
  const [termo, setTermo] = useState('')
  const [form, setForm] = useState(vazio)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const navigate = useNavigate()

  function tratarErro(e: unknown) {
    const msg = (e as Error).message
    if (msg.includes('autenticado') || msg.includes('expirada')) navigate('/login')
    setErro(msg)
  }

  async function carregar(busca = '') {
    try {
      setTutores(await api.get<Tutor[]>(`/tutores?busca=${encodeURIComponent(busca)}`))
    } catch (e) {
      tratarErro(e)
    }
  }

  useEffect(() => {
    carregar()
    // eslint-disable-next-line
  }, [])

  function buscar(e: SyntheticEvent) {
    e.preventDefault()
    carregar(termo)
  }

  function editar(t: Tutor) {
    setEditandoId(t.id)
    setForm({
      nome: t.nome,
      cpf: t.cpf,
      telefone: t.telefone,
      email: t.email ?? '',
      endereco: t.endereco ?? '',
    })
    setErro('')
    setSucesso('')
  }

  function cancelar() {
    setEditandoId(null)
    setForm(vazio)
  }

  async function salvar(e: SyntheticEvent) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    try {
      if (editandoId) {
        await api.put(`/tutores/${editandoId}`, form)
        setSucesso('Tutor atualizado com sucesso!')
      } else {
        await api.post('/tutores', form)
        setSucesso('Tutor cadastrado com sucesso!')
      }
      cancelar()
      carregar(termo)
    } catch (e) {
      tratarErro(e)
    }
  }

  const mascarar = (cpf: string) => `***.***.***-${cpf.slice(9)}`

  return (
    <main>
      <Link to="/">← Voltar</Link>
      <h1>Tutores</h1>

      <form onSubmit={buscar}>
        <input
          placeholder="Buscar por nome, CPF, telefone ou e-mail"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      {erro && <p className="erro">{erro}</p>}
      {sucesso && <p>{sucesso}</p>}

      <table>
        <thead>
          <tr>
            <th>Nome</th><th>CPF</th><th>Telefone</th><th>E-mail</th><th>Endereço</th><th></th>
          </tr>
        </thead>
        <tbody>
          {tutores.map((t) => (
            <tr key={t.id}>
              <td>{t.nome}</td>
              <td>{mascarar(t.cpf)}</td>
              <td>{t.telefone}</td>
              <td>{t.email}</td>
              <td>{t.endereco}</td>
              <td><button onClick={() => editar(t)}>Editar</button></td>
            </tr>
          ))}
          {tutores.length === 0 && (
            <tr><td colSpan={6}>Nenhum tutor encontrado.</td></tr>
          )}
        </tbody>
      </table>

      <h2>{editandoId ? 'Editar tutor' : 'Novo tutor'}</h2>
      <form onSubmit={salvar}>
        <input placeholder="Nome" value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })} />
        <input placeholder="CPF (só números)" value={form.cpf} maxLength={14}
          onChange={(e) => setForm({ ...form, cpf: e.target.value })} />
        <input placeholder="Telefone" value={form.telefone}
          onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
        <input placeholder="E-mail" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Endereço" value={form.endereco}
          onChange={(e) => setForm({ ...form, endereco: e.target.value })} />
        <button type="submit">{editandoId ? 'Salvar alterações' : 'Cadastrar'}</button>
        {editandoId && <button type="button" onClick={cancelar}>Cancelar</button>}
      </form>
    </main>
  )
}