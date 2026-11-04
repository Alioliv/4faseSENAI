# Back-end: login, cadastro e permissões

## Executar

1. Instale as dependências com `npm install`.
2. Configure `.env` usando `.env.example`: conexão com MySQL e `JWT_SECRET` com pelo menos 32 caracteres.
3. No banco indicado em `DB_NAME`, execute `sql/users.sql`. O arquivo cria a tabela de usuários sem cadastrar contas prontas. Se ela já existir, confira os campos e o índice UNIQUE de e-mail; o script não modifica tabelas existentes.
4. Execute `npm start`. A API usa a porta 8081 por padrão.

A listagem de materiais continua usando a tabela `materials` preparada na aula. O comando antigo `npm run seed` depende de um arquivo ausente neste projeto; use o SQL acima para preparar o cadastro.

O mesmo arquivo SQL cria a tabela `logs` usada pela auditoria. Se as tabelas ja existirem, confira as estruturas com `SHOW CREATE TABLE materials;` e `SHOW CREATE TABLE logs;`. A tabela de logs precisa dos campos `usuario`, `datahora`, `acao`, `mensagem`, `recurso_afetado`, `id_recurso_afetado`, `valor_antigo`, `valor_novo`, `campos_alterados`, `ip`, `codigo_http` e `status_acao`.

## Cadastro explicado

- `src/controllers/register.js`: valida nome, e-mail e senha; verifica duplicidade; gera o hash com bcrypt; salva com SQL parametrizado.
- `src/routers/auth.js`: publica `POST /api/register` e `POST /api/login`.
- `src/controllers/log.js`: grava eventos na mesma transacao dos materiais e lista os mais recentes.
- `src/routers/logs.js`: protege a consulta de auditoria para administradores.
- `sql/users.sql`: define a tabela e impede e-mails duplicados com UNIQUE.

O cadastro recebe `name`, `email` e `password`. Nome aceita até 100 caracteres, e-mail até 254 e senha pelo menos 8 caracteres e no máximo 72 bytes (limite do bcrypt). A senha original não é salva nem devolvida.

A resposta de sucesso é HTTP 201 com uma mensagem. Dados inválidos retornam 400 e e-mail já cadastrado retorna 409. O aluno volta ao login para obter seu token.

## Perfis

O cadastro público sempre cria `user`, que pode consultar materiais. O perfil `admin` também pode excluir. Enviar `role: "admin"` no cadastro não concede essa permissão.

Para a atividade, o professor pode executar no banco, substituindo o e-mail pelo da conta criada:

```sql
UPDATE users SET role = 'admin' WHERE email = 'email-da-conta-cadastrada';
```

Depois, saia e entre novamente: o perfil do token é definido no login.

## Rotas

- `POST /api/register`: cadastro público.
- `POST /api/login`: login público; devolve token e dados do usuário.
- `GET /api/materials`: consulta autenticada para os dois perfis.
- `DELETE /api/materials/:id`: exclusão apenas para admin.
- `POST /api/materials`: adiciona material; apenas admin.
- `PUT /api/materials/:id`: edita material; apenas admin.
- `GET /api/logs`: consulta as ultimas 100 alteracoes; apenas admin.

## Auditoria de materiais

### Tentativas de login

Cada tentativa em `POST /api/login` grava um log com acao `login`: sucesso (200), senha ou e-mail incorreto (401), dados invalidos (400) ou bloqueio (429). O log guarda o e-mail informado na mensagem e o ID do usuario quando identificado, sem senha ou token.

Apos 5 falhas por IP, novas tentativas ficam bloqueadas por 3 minutos completos, mesmo com a senha correta. O cabecalho `Retry-After` informa os segundos restantes. Tentativas bloqueadas nao prolongam o prazo. Um login bem-sucedido zera as falhas; falhas sem novas tentativas expiram em 3 minutos. O controle fica em memoria para simplificar a aula: reiniciar o servidor limpa os registros e cada instancia tem seu proprio controle.

Cada inclusao, edicao ou exclusao grava quem fez a acao, data e hora, IP, resposta HTTP e os dados anteriores/novos. A mudanca e o log usam a mesma transacao MySQL: se nao for possivel salvar a auditoria, a mudanca tambem e desfeita. Assim, a operacao nao retorna sucesso sem o registro correspondente.

Os dados anteriores ficam em `valor_antigo` e os novos em `valor_novo`, como texto JSON. Na inclusao, o valor antigo e nulo; na exclusao, o novo e nulo. `campos_alterados` guarda os nomes dos campos que mudaram (`name`, `category`). O banco preenche `id` e `datahora` automaticamente. A tela de auditoria permite consultar esses dados; a consulta e limitada a 100 eventos e so admins podem acessa-la.

Se a tabela do print ja existe, execute este ajuste uma vez para os valores completos caberem, mesmo com nome e categoria de 150 caracteres:

```sql
ALTER TABLE logs
  MODIFY valor_antigo TEXT NULL,
  MODIFY valor_novo TEXT NULL;
```

As rotas protegidas recebem `Authorization: Bearer SEU_TOKEN`.

## Testes

Execute `npm test`. Os testes fazem chamadas HTTP com banco simulado e verificam cadastro, hash, duplicidade, validacao, login, permissoes, alteracoes e rollback quando o registro de auditoria falha. A integracao com o MySQL deve ser conferida com o banco da aula.
