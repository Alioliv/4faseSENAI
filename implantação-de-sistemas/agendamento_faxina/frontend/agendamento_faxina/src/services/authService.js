// O banco (faxina_db) não possui tabela de usuário — a autenticação aqui
// é local/mock apenas para controlar o acesso à interface (RF01-RF03).
// Se depois for necessário autenticação real, crie uma tabela Usuario
// no banco e troque esta implementação por chamadas à API.

const USUARIO_TESTE = { id: 1, nome: 'Administrador', usuario: 'admin', senha: '1234' }

export function login(usuario, senha) {
  if (usuario !== USUARIO_TESTE.usuario || senha !== USUARIO_TESTE.senha) {
    throw new Error('Usuário ou senha inválidos.')
  }
  localStorage.setItem('faxina_sessao', JSON.stringify(USUARIO_TESTE))
  return USUARIO_TESTE
}

export function logout() {
  localStorage.removeItem('faxina_sessao')
}

export function getUsuarioLogado() {
  const sessao = localStorage.getItem('faxina_sessao')
  return sessao ? JSON.parse(sessao) : null
}