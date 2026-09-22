import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 8081;

const db = await mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "desi_20251"
});

// ===============================
// LOGIN
// ===============================

app.post("/login", async (req, res) => {

    const { email, senha } = req.body;

    try {

        const [usuarios] = await db.query(
            `SELECT * FROM usuario 
             WHERE email = '${email}' 
             AND senha = '${senha}'`
        );

        if (usuarios.length > 0) {

            res.json({
                mensagem: "Login realizado com sucesso!",
                usuario: usuarios[0]
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

app.get("/usuarios/:id", async (req, res) => {

    const { id } = req.params;

    try {

        const [usuarios] = await db.query(
            `SELECT * FROM usuario WHERE id = ${id}`
        );

        if (usuarios.length === 0) {

            return res.status(404).json({
                mensagem: "Usuário não encontrado"
            });

        }

        res.json(usuarios[0]);

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

app.delete("/usuarios/:id", async (req, res) => {

    const { id } = req.params;

    try {

        const [usuarios] = await db.query(
            `SELECT * FROM usuario WHERE id = ${id}`
        );

        if (usuarios.length === 0) {

            return res.status(404).json({
                mensagem: "Usuário não encontrado"
            });

        }

        await db.query(
            `DELETE FROM usuario WHERE id = ${id}`
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

app.get("/erro", (req, res) => {
    throw new Error(
        "Erro no banco de dados: senha do banco = 123456"
    );
});


// ===============================
// SERVIDOR
// ===============================

app.listen(PORT, () => {
    console.log(
        `Servidor rodando na portinha => http://localhost:${PORT}/`
    );
});