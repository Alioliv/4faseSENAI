import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

app.use(express.json());

// ===============================
// [FIX #4 - A02:2025 Security Misconfiguration]
// CORS antes: app.use(cors()) liberava QUALQUER origem para
// requisitar a API. Agora restringimos a um domínio conhecido,
// configurável via .env.
// ===============================
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
    })
);

const PORT = process.env.PORT || 8081;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error(
        "JWT_SECRET não definido no .env. Configure antes de iniciar o servidor."
    );
}

// ===============================
// [FIX #4 - A02:2025 Security Misconfiguration]
// Antes: host/usuário/senha/banco ficavam fixos no código-fonte
// (inclusive com senha vazia). Agora vêm do .env, que não é
// versionado (deve estar no .gitignore).
// ===============================
const db = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// ===============================
// [FIX #6 - A07:2025 Identification and Authentication Failures]
// Limita tentativas de login por IP para dificultar força bruta
// de senha, sem afetar o uso normal da rota.
// ===============================
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // 10 tentativas por IP nesse período
    message: {
        mensagem: "Muitas tentativas de login. Tente novamente mais tarde.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// ===============================
// [FIX #3 - A01:2025 Broken Access Control]
// Middleware de autenticação: exige um token JWT válido para
// acessar rotas sensíveis (buscar/excluir usuário).
// ===============================
function autenticar(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ mensagem: "Token não informado" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.usuarioLogado = payload;
        next();
    } catch (error) {
        return res.status(401).json({ mensagem: "Token inválido ou expirado" });
    }
}

// ===============================
// [FIX #3 - A01:2025 Broken Access Control]
// Middleware de autorização: só deixa passar quem tem perfil
// "admin" (usado na exclusão de usuário).
// ===============================
function apenasAdmin(req, res, next) {
    if (req.usuarioLogado?.perfil !== "admin") {
        return res
            .status(403)
            .json({ mensagem: "Acesso negado: requer perfil administrador" });
    }
    next();
}

// ===============================
// LOGIN
// ===============================

app.post("/login", loginLimiter, async (req, res) => {

    const { email, senha } = req.body;

    if (!email || !senha) {
        return res
            .status(400)
            .json({ mensagem: "Informe email e senha" });
    }

    try {

        // [FIX #1 - A05:2025 Injection]
        // Antes: a query concatenava email/senha diretamente na string SQL
        // (`WHERE email = '${email}' AND senha = '${senha}'`), permitindo
        // SQL Injection (ex.: email = "' OR '1'='1"). Agora usamos
        // placeholders (?) com bind de parâmetros.
        const [usuarios] = await db.query(
            `SELECT * FROM usuario WHERE email = ?`,
            [email]
        );

        const usuario = usuarios[0];

        // [FIX #2 - A04:2025 Cryptographic Failures]
        // Antes: a senha era comparada em texto puro e armazenada em
        // texto puro no banco. Agora comparamos o hash com bcrypt.
        // (Os usuários existentes precisam ser recadastrados com senha
        // hasheada — ver seed atualizado.)
        const senhaValida =
            usuario && (await bcrypt.compare(senha, usuario.senha));

        if (usuario && senhaValida) {

            const token = jwt.sign(
                { id: usuario.id, perfil: usuario.perfil },
                JWT_SECRET,
                { expiresIn: "2h" }
            );

            // [FIX #6 - A07:2025 Identification and Authentication Failures]
            // Antes: o objeto do usuário (incluindo a senha/hash) era
            // devolvido inteiro na resposta. Agora removemos a senha
            // antes de responder.
            const { senha: _senha, ...usuarioSemSenha } = usuario;

            res.json({
                mensagem: "Login realizado com sucesso!",
                token,
                usuario: usuarioSemSenha,
            });

        } else {

            res.status(401).json({
                mensagem: "Usuário ou senha incorretos"
            });

        }

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensagem: "Erro ao realizar login"
        });

    }

});


// ===============================
// BUSCAR USUÁRIO
// ===============================

// [FIX #3 - A01:2025 Broken Access Control]
// Antes: qualquer pessoa, sem login, podia consultar dados de
// qualquer usuário pelo id. Agora exige token válido.
app.get("/usuarios/:id", autenticar, async (req, res) => {

    const { id } = req.params;

    try {

        // [FIX #1 - A05:2025 Injection]
        // Antes: `WHERE id = ${id}` concatenava o parâmetro direto na
        // query. Agora usa placeholder com bind.
        const [usuarios] = await db.query(
            `SELECT * FROM usuario WHERE id = ?`,
            [id]
        );

        if (usuarios.length === 0) {

            return res.status(404).json({
                mensagem: "Usuário não encontrado"
            });

        }

        const { senha, ...usuarioSemSenha } = usuarios[0];

        res.json(usuarioSemSenha);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensagem: "Erro ao buscar usuário"
        });

    }

});


// ===============================
// ÁREA ADMINISTRATIVA
// ===============================

// [FIX #3 - A01:2025 Broken Access Control]
// Antes: qualquer pessoa podia excluir qualquer usuário sem estar
// logada. Agora exige token válido E perfil "admin".
app.delete("/usuarios/:id", autenticar, apenasAdmin, async (req, res) => {

    const { id } = req.params;

    try {

        // [FIX #1 - A05:2025 Injection]
        const [usuarios] = await db.query(
            `SELECT * FROM usuario WHERE id = ?`,
            [id]
        );

        if (usuarios.length === 0) {

            return res.status(404).json({
                mensagem: "Usuário não encontrado"
            });

        }

        // [FIX #1 - A05:2025 Injection]
        await db.query(
            `DELETE FROM usuario WHERE id = ?`,
            [id]
        );

        res.json({
            mensagem: `Usuário ${usuarios[0].nome} excluído com sucesso!`
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensagem: "Erro ao excluir usuário"
        });

    }

});

// ===============================
// TRATAMENTO DE ERRO
// ===============================
// [FIX #5 - A10:2025 Mishandling of Exceptional Conditions /
//  A02:2025 Security Misconfiguration]
// A rota "/erro" original expunha de propósito dados sensíveis
// (senha do banco) na mensagem de erro devolvida ao cliente. Ela
// foi removida. No lugar, um middleware genérico de erro garante
// que nenhuma exceção da aplicação vaze detalhes internos
// (stack trace, credenciais, nomes de tabela etc.) para quem
// chama a API — o detalhe completo só vai para o log do servidor.
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        mensagem: "Erro interno do servidor",
    });
});


// ===============================
// SERVIDOR
// ===============================

app.listen(PORT, () => {
    console.log(
        `Servidor rodando na portinha => http://localhost:${PORT}/`
    );
});