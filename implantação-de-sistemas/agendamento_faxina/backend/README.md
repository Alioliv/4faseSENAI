# faxina-backend

API do sistema de agendamento de faxinas — Node.js + Express + Prisma,
conectando no MySQL (`faxina_db`).

## Setup

```bash
npm install

cp .env.example .env
# edite o .env com usuário/senha reais do seu MySQL

npx prisma generate
```

Não rode `npx prisma migrate dev` — as tabelas já existem no seu
banco. Se quiser ter 100% de certeza de que o `prisma/schema.prisma`
bate com a estrutura real do banco, rode:

```bash
npx prisma db pull
```

Isso reescreve o schema a partir do banco de verdade. Se o resultado
for igual ao que já está aqui, ótimo — só confirma que está tudo
alinhado.

## Rodando

```bash
npm run dev
```

Servidor sobe em `http://localhost:3000`. Teste com:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/clientes
```

## Endpoints

| Método | Rota                        | RF relacionado         |
| ------ | --------------------------- | ----------------------- |
| GET    | /api/clientes                | —                       |
| POST   | /api/clientes                | —                       |
| PUT    | /api/clientes/:id            | —                       |
| DELETE | /api/clientes/:id            | —                       |
| GET    | /api/profissionais            | —                       |
| POST   | /api/profissionais            | —                       |
| PUT    | /api/profissionais/:id        | —                       |
| DELETE | /api/profissionais/:id        | —                       |
| GET    | /api/agendamentos             | RF06                    |
| GET    | /api/agendamentos?termo=X     | RF07                    |
| GET    | /api/agendamentos?ordenar=X   | RF13 (`data`\|`alfabetica`) |
| GET    | /api/agendamentos/proximos    | RF18                    |
| POST   | /api/agendamentos             | RF08, RF11, RF16        |
| PUT    | /api/agendamentos/:id         | RF09, RF16              |
| DELETE | /api/agendamentos/:id         | RF10                    |



## Conectando o front

No `faxina-frontend`, troque a implementação dos arquivos em
`src/services/*.js` (que hoje usam `localStorage`) para chamar
`src/api/axiosConfig.js` apontando pra essas rotas. A `baseURL` já
está configurada como `http://localhost:3000/api`.
