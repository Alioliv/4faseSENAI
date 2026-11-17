import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import rotas from './routes/index';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(cookieParser());

// Todas as rotas da API ficam sob /api (o front em Vite repassa /api para cá)
app.use('/api', rotas);

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}/api`);
});
