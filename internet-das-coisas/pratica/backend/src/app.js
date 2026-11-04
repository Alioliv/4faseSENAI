const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const verificarLogin = require('./middlewares/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const veiculoRoutes = require('./routes/veiculoRoutes');
const ordemServicoRoutes = require('./routes/ordemServicoRoutes');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 }, // sessão expira em 30 min
}));

app.use('/auth', authRoutes);
app.use('/clientes', verificarLogin, clienteRoutes);
app.use('/veiculos', verificarLogin, veiculoRoutes);
app.use('/ordens-servico', verificarLogin, ordemServicoRoutes);

module.exports = app;
