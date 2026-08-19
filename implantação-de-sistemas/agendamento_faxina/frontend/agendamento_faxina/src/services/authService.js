import api from '../api/axiosConfig'

function mensagemErro(err, fallback) {
  return err.response?.data?.erro || fallback
}

export async function login(usuario, senha) {
  try {
    const { data } = await api.post('/auth/login', { usuario, senha })
    localStorage.setItem('faxina_sessao', JSON.stringify(data))
    return data
  } catch (err) {
    throw new Error(mensagemErro(err, 'Usuário ou senha inválidos.'))
  }
}

export async function cadastrar(nome, usuario, senha) {
  try {
    const { data } = await api.post('/auth/cadastro', { nome, usuario, senha })
    localStorage.setItem('faxina_sessao', JSON.stringify(data))
    return data
  } catch (err) {
    throw new Error(mensagemErro(err, 'Não foi possível cadastrar o usuário.'))
  }
}

export function logout() {
  localStorage.removeItem('faxina_sessao')
}

export function getUsuarioLogado() {
  const sessao = localStorage.getItem('faxina_sessao')
  return sessao ? JSON.parse(sessao) : null
}