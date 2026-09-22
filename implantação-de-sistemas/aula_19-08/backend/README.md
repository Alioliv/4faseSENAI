# Atividade Prática 

Injeção de SQL ( — Injection) — nas 3 queries que concatenavam email, senha e id direto na string.

Senha em texto puro ( — Cryptographic Failures) — bcrypt já estava no package.json mas nunca era usado.

Controle de acesso quebrado  — GET /usuarios/:id e DELETE /usuarios/:id eram públicas, sem login nem checagem de perfil.

Configuração insegura  — CORS liberado pra qualquer origem e credenciais do banco fixas no código.

Vazamento de dado sensível em erro  — Mishandling of Exceptional Conditions, nova categoria de 2025 — a rota /erro expunha a senha do banco de propósito.

Falha de autenticação  — login devolvia o objeto do usuário inteiro (com a senha) e não tinha limite de tentativas.
