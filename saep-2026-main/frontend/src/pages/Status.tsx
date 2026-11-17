import { useEffect, useState } from 'react'
import { api } from '../services/api'

type StatusApi = {
  api: string
  banco: string
}

export default function Status() {
  const [status, setStatus] = useState<StatusApi | null>(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    api
      .get<StatusApi>('/status')
      .then(setStatus)
      .catch((e: Error) => setErro(e.message))
  }, [])

  return (
    <main>
      <h1>SAEP - Clínica Veterinária</h1>
      <p>Projeto configurado. Comece a implementar a partir daqui.</p>

      <h2>Conexão</h2>
      {erro && <p className="erro">Falha ao acessar a API: {erro}</p>}
      {!erro && !status && <p>Verificando...</p>}
      {status && (
        <ul>
          <li>API: {status.api}</li>
          <li>Banco de dados: {status.banco}</li>
        </ul>
      )}
    </main>
  )
}
