// Seed inicial em localStorage, espelhando as tabelas reais do banco
// (Cliente, Profissional, Agendamento em faxina_db). Serve só para o
// front funcionar sozinho enquanto o back (Node/Express/Prisma) não existe.
// Assim que o back estiver pronto, os services passam a chamar a API
// e este arquivo deixa de ser usado.

const KEYS = {
  clientes: 'faxina_clientes',
  profissionais: 'faxina_profissionais',
  agendamentos: 'faxina_agendamentos'
}

function seedIfEmpty(key, data) {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

export function initSeedData() {
  seedIfEmpty(KEYS.clientes, [
    {
      id_cliente: 1,
      nome: 'Maria Souza',
      email: 'maria.souza@email.com',
      telefone: '47999990001',
      endereco: 'Rua das Flores, 123 - Joinville/SC',
      tipo_cliente: 'residencial'
    },
    {
      id_cliente: 2,
      nome: 'João Pereira',
      email: 'joao.pereira@email.com',
      telefone: '47999990002',
      endereco: 'Av. Central, 456 - Joinville/SC',
      tipo_cliente: 'residencial'
    },
    {
      id_cliente: 3,
      nome: 'Comercial Litoral Ltda',
      email: 'contato@litoral.com',
      telefone: '47999990003',
      endereco: 'Rua Comercial, 789 - Joinville/SC',
      tipo_cliente: 'comercial'
    }
  ])

  seedIfEmpty(KEYS.profissionais, [
    { id_profissional: 1, nome: 'Ana Ferreira', telefone: '47988880001', especialidade: 'residencial', disponivel: true },
    { id_profissional: 2, nome: 'Carlos Lima', telefone: '47988880002', especialidade: 'comercial', disponivel: true },
    { id_profissional: 3, nome: 'Patrícia Gomes', telefone: '47988880003', especialidade: 'ambos', disponivel: true }
  ])

  seedIfEmpty(KEYS.agendamentos, [
    {
      id_agendamento: 1,
      id_cliente: 1,
      id_profissional: 1,
      tipo_servico: 'residencial',
      data_agendamento: '2026-08-10',
      horario: '09:00',
      status: 'confirmado',
      observacoes: 'Cliente solicitou uso de produtos hipoalergênicos',
      criado_em: new Date().toISOString()
    },
    {
      id_agendamento: 2,
      id_cliente: 2,
      id_profissional: 3,
      tipo_servico: 'residencial',
      data_agendamento: '2026-08-11',
      horario: '14:00',
      status: 'pendente',
      observacoes: null,
      criado_em: new Date().toISOString()
    },
    {
      id_agendamento: 3,
      id_cliente: 3,
      id_profissional: 2,
      tipo_servico: 'comercial',
      data_agendamento: '2026-08-12',
      horario: '08:00',
      status: 'confirmado',
      observacoes: 'Faxina pós-obra, sala comercial 200m²',
      criado_em: new Date().toISOString()
    }
  ])
}

export { KEYS }
