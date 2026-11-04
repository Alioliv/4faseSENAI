// Insere o evento na mesma conexao e transacao que alterou o material.
export async function registerLog(connection, event) {
  const sql = `
    INSERT INTO logs (
      usuario, acao, mensagem, recurso_afetado, id_recurso_afetado,
      valor_antigo, valor_novo, campos_alterados, ip, codigo_http, status_acao
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await connection.execute(sql, [
    event.usuario,
    event.acao,
    event.mensagem,
    event.recurso_afetado,
    event.id_recurso_afetado,
    event.valor_antigo,
    event.valor_novo,
    event.campos_alterados,
    event.ip,
    event.codigo_http,
    event.status_acao,
  ]);

  // Um log nao pode falhar silenciosamente: o controller desfaz a transacao.
  if (result.affectedRows !== 1) {
    throw new Error("Nao foi possivel registrar a auditoria.");
  }
}

// Login nao altera um material: os campos de valores ficam nulos.
export async function registerLoginLog(req, code, status, userId = null) {
  const email = typeof req.body?.email === "string"
    ? req.body.email.trim().toLowerCase().slice(0, 254) : "nao informado";
  await registerLog(req.app.locals.db, {
    usuario: userId,
    acao: "login",
    mensagem: `Tentativa de login: ${email}. Resultado: ${status}.`,
    recurso_afetado: "users",
    id_recurso_afetado: userId === null ? null : String(userId),
    valor_antigo: null,
    valor_novo: null,
    campos_alterados: null,
    ip: req.ip,
    codigo_http: code,
    status_acao: status,
  });
}

// Consulta os eventos mais recentes; a rota limita este controller a admins.
export async function listLogs(req, res) {
  const [rows] = await req.app.locals.db.execute(`
    SELECT
      logs.id, logs.usuario, users.name AS nome_usuario, logs.datahora,
      logs.acao, logs.mensagem, logs.recurso_afetado,
      logs.id_recurso_afetado, logs.valor_antigo, logs.valor_novo,
      logs.campos_alterados, logs.ip,
      logs.codigo_http, logs.status_acao
    FROM logs
    LEFT JOIN users ON users.id = logs.usuario
    ORDER BY logs.datahora DESC, logs.id DESC
    LIMIT 100
  `);
  res.json(rows);
}
