import db from '../config/database.js';

export const createUser = async (req, res) => {
    const {
        nome,
        email,
        senha,
        cpf,
        logradouro,
        bairro,
        estado,
        numero,
        cidade
    } = req.body;

    // validação dos campos
    // typeof verifica o tipo da variável, se for diferente de string, retorna erro
    // trim remove os espaços em branco do início e do fim da string, se for vazio, retorna erro

    if (!nome || typeof nome !== 'string' || nome.trim().length <= 3) {
        return res.status(400).json({
            message: 'Nome inválido. Este campo é obrigatório.',
            success: false
        });
    }

    if (
        !email ||
        typeof email !== 'string' ||
        !email.includes('@') ||
        email.trim().length > 150
    ) {
        return res.status(400).json({
            message: 'Email inválido. Este campo é obrigatório.',
            success: false
        });
    }

    if (!cpf || typeof cpf !== 'string') {
        return res.status(400).json({
            message: 'CPF inválido. Este campo é obrigatório.',
            success: false
        });
    }

    if (!senha || typeof senha !== 'string') {
        return res.status(400).json({
            message: 'Senha inválida. Este campo é obrigatório.',
            success: false
        });
    } else {
        if (senha.length < 8 || senha.length > 32) {
            return res.status(400).json({
                message: 'Senha inválida. Deve ter entre 8 e 32 caracteres.',
                success: false
            });
        }
    }

    // Sanitização é o processo de limpar e validar os dados de entrada para garantir que eles estejam no formato correto e não contenham caracteres maliciosos. Isso ajuda a prevenir ataques de injeção de SQL, XSS (Cross-Site Scripting) e outros tipos de vulnerabilidades.

    if (!validarCPF(cpf) && !validarCNPJ(cpf)) {
        return res.status(400).json({
            message: 'CPF ou CNPJ inválido.',
            success: false
        });
    }

    // remove hifen e ponto
    const cpfLimpo = cpf.replace(/\D/g, ''); // 123.456.789-00 => 12345678900

    const nomeSanitizado = nome.trim().replace(/\s+/g, ' ');
    // remove espaços em branco do início e do fim da string e substitui múltiplos espaços por um único espaço

    const emailSanitizado = email.trim().toLowerCase();

    try {
        // Insere os dados do usuário no banco de dados
        // A coluna no banco se chama "name", por isso usamos name no SQL
        const sql = `
            INSERT INTO usuario (name, email, senha, cpf)
            VALUES (?, ?, ?, ?)
        `;

        const valores = [
            nomeSanitizado,
            emailSanitizado,
            senha,
            cpfLimpo
        ];

        const [result] = await db.execute(sql, valores);

        if (result.affectedRows === 0) {
            return res.status(400).json({
                message: 'Erro ao criar usuário.',
                success: false
            });
        }

        return res.status(201).json({
            message: 'Usuário criado com sucesso.',
            success: true,
            idusuario: result.insertId
        });

    } catch (error) {
        // Mostra o erro real no terminal do backend
        console.error(error);

        return res.status(500).json({
            message: 'Erro interno.',
            success: false
        });
    }
};

// função de validação de CNPJ e CPF

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {
        soma += Number(cpf[i]) * (10 - i);
    }

    let resto = (soma * 10) % 11;

    if (resto === 10) {
        resto = 0;
    }

    if (resto !== Number(cpf[9])) {
        return false;
    }

    soma = 0;

    for (let i = 0; i < 10; i++) {
        soma += Number(cpf[i]) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10) {
        resto = 0;
    }

    return resto === Number(cpf[10]);
}

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');

    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
        return false;
    }

    let tamanho = 12;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);

    let soma = 0;
    let pos = 5;

    for (let i = 0; i < tamanho; i++) {
        soma += Number(numeros[i]) * pos;
        pos--;

        if (pos < 2) {
            pos = 9;
        }
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    if (resultado !== Number(digitos[0])) {
        return false;
    }

    tamanho = 13;
    numeros = cnpj.substring(0, tamanho);

    soma = 0;
    pos = 6;

    for (let i = 0; i < tamanho; i++) {
        soma += Number(numeros[i]) * pos;
        pos--;

        if (pos < 2) {
            pos = 9;
        }
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    return resultado === Number(digitos[1]);
}