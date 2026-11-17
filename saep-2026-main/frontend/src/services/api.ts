// Cliente HTTP da aplicação. Todas as chamadas passam por /api,
// que o Vite repassa para o backend (ver vite.config.ts).
const BASE_URL = '/api'

async function request<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  const resposta = await fetch(`${BASE_URL}${caminho}`, {
    ...opcoes,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...opcoes.headers,
    },
  })

  const dados = await resposta.json().catch(() => null)

  if (!resposta.ok) {
    throw new Error(dados?.mensagem ?? `Erro ${resposta.status}`)
  }

  return dados as T
}

export const api = {
  get: <T>(caminho: string) => request<T>(caminho),
  post: <T>(caminho: string, corpo?: unknown) =>
    request<T>(caminho, { method: 'POST', body: JSON.stringify(corpo) }),
  put: <T>(caminho: string, corpo?: unknown) =>
    request<T>(caminho, { method: 'PUT', body: JSON.stringify(corpo) }),
  delete: <T>(caminho: string) => request<T>(caminho, { method: 'DELETE' }),
}
