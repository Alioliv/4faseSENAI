# sistema — SAEP Clínica Veterinária

Backend em Node.js + TypeScript + Express + PostgreSQL (API JSON) e frontend em React + Vite + TypeScript.
As dependências já estão instaladas nos dois `node_modules` (a prova é sem internet).

## Estrutura

```
sistema/
├── backend/                       # API (Express)
│   ├── src/
│   │   ├── server.ts              # ponto de entrada (rotas em /api)
│   │   ├── config/
│   │   │   ├── db.ts              # pool de conexão com o PostgreSQL
│   │   │   └── testarConexao.ts   # script para testar a conexão
│   │   └── routes/index.ts        # rotas da API (já tem GET /api/status)
│   ├── .env / .env.example        # configuração do backend
│   └── package.json / tsconfig.json
│
└── frontend/                      # telas (React + Vite)
    ├── vite.config.ts             # proxy: /api -> http://localhost:3000
    └── src/
        ├── main.tsx
        ├── App.tsx                # rotas das telas (react-router-dom)
        ├── services/api.ts        # cliente HTTP: api.get/post/put/delete
        └── pages/Status.tsx       # tela inicial que testa a conexão com a API
```

## Como rodar

1. Banco de dados — no PostgreSQL da máquina, crie o banco e rode o seu script:
   ```
   psql -U postgres -c "CREATE DATABASE saep_db"
   psql -U postgres -d saep_db -f saep_db.sql
   ```
   (ou pelo pgAdmin, se preferir)
2. Ajuste usuário/senha do banco em `backend/.env`.
3. Backend (terminal 1):
   ```
   cd backend
   npm run db:test   # testa a conexão com o banco
   npm run dev       # API em http://localhost:3000/api
   ```
4. Frontend (terminal 2):
   ```
   cd frontend
   npm run dev       # tela em http://localhost:5173
   ```
   A tela inicial mostra se a API e o banco estão conectados.

## Chamando a API no front

```ts
import { api } from '../services/api'

const dados = await api.get<MeuTipo[]>('/minha-rota')   // GET /api/minha-rota
await api.post('/minha-rota', { campo: 'valor' })
```

O Vite repassa `/api` para o backend, então não precisa configurar CORS e os cookies funcionam.

## Bibliotecas disponíveis

Backend: `express`, `pg`, `dotenv`, `express-session`, `cookie-parser`, `jsonwebtoken`, `bcryptjs`, `crypto` (nativo do Node).

Frontend: `react`, `react-dom`, `react-router-dom`.
