import { registerLog } from "./log.js";

// Confere e limpa os campos antes de salvar dados enviados pelo navegador.
function validateMaterial(req, res) {
  const { name, category } = req.body || {};
  if (
    typeof name !== "string" ||
    typeof category !== "string" ||
    !name.trim() ||
    !category.trim() ||
    name.trim().length > 150 ||
    category.trim().length > 150
  ) {
    res.status(400).json({ message: "Informe nome e categoria com ate 150 caracteres." });
    return null;
  }

  return { name: name.trim(), category: category.trim() };
}

// Usa uma transacao para nunca salvar uma mudanca sem o respectivo registro.
async function inTransaction(db, action) { // db e o pool; action e a funcao com as operacoes que devem acontecer juntas.
  const connection = await db.getConnection(); // Pega uma conexao do pool; await espera essa operacao terminar.
  let started = false; // Guarda se a transacao ja comecou; inicialmente, ainda nao comecou.
  try { // Tenta executar as operacoes abaixo; se houver erro, segue para o catch.
    await connection.beginTransaction(); // Inicia a transacao: as alteracoes ainda nao estao confirmadas.
    started = true; // Marca que a transacao iniciou e pode precisar ser desfeita.
    const result = await action(connection); // Executa a funcao recebida, passando a mesma conexao para alterar o material e salvar o log.
    await connection.commit(); // Confirma no banco todas as alteracoes feitas nesta transacao.
    return result; // Devolve o resultado de action para quem chamou inTransaction.
  } catch (error) { // Recebe um erro ocorrido no bloco try.
    if (started) await connection.rollback(); // Se a transacao comecou, desfaz suas alteracoes ainda nao confirmadas.
    throw error; // Repassa o erro para quem chamou a funcao; a operacao nao terminou com sucesso.
  } finally { // Executa ao sair do try ou catch, inclusive quando existe return ou erro.
    connection.release(); // Devolve a conexao ao pool para que outras requisicoes possam usa-la.
  } // Encerra o bloco finally.
} // Encerra a funcao inTransaction.

// Guarda o usuario autenticado e o endereco de origem junto com cada evento.
function logDetails(req, action, message, id, before, after, statusCode) {
  // Na criacao e exclusao, todos os campos participam da acao.
  // Na edicao, guardamos somente os nomes dos campos que mudaram.
  const changedFields = ["name", "category"].filter(
    field => before?.[field] !== after?.[field]
  );

  return {
    usuario: Number(req.user.sub),
    acao: action,
    mensagem: message,
    recurso_afetado: "materials",
    id_recurso_afetado: String(id),
    // JSON transforma o objeto em texto para salvar no banco.
    // Na criacao nao existe valor antigo; na exclusao nao existe valor novo.
    valor_antigo: before ? JSON.stringify(before) : null,
    valor_novo: after ? JSON.stringify(after) : null,
    campos_alterados: changedFields.join(", "),
    ip: req.ip,
    codigo_http: statusCode,
    status_acao: "sucesso",
  };
}

// Lista materiais para qualquer usuario autenticado.
export async function listMaterials(req, res) {
  const [rows] = await req.app.locals.db.execute(
    "SELECT id, name, category FROM materials ORDER BY id"
  );
  res.json(rows);
}

// Cria material e log na mesma transacao.
export async function addMaterial(req, res) {
  const material = validateMaterial(req, res);
  if (!material) return;

  const created = await inTransaction(req.app.locals.db, async connection => {
    const [result] = await connection.execute(
      "INSERT INTO materials (name, category) VALUES (?, ?)",
      [material.name, material.category]
    );
    const newMaterial = { id: result.insertId, ...material };

    await registerLog(connection, logDetails(
      req, "adicao", "Material adicionado.", result.insertId, null, newMaterial, 201
    ));
    return newMaterial;
  });

  res.status(201).json(created);
}

// Atualiza os dois campos e registra os valores antigos e novos.
export async function editMaterial(req, res) {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ message: "ID invalido." });
  }
  const material = validateMaterial(req, res);
  if (!material) return;

  const updated = await inTransaction(req.app.locals.db, async connection => {
    const [rows] = await connection.execute(
      "SELECT id, name, category FROM materials WHERE id = ? FOR UPDATE",
      [id]
    );
    const before = rows[0];
    if (!before) return null;

    await connection.execute(
      "UPDATE materials SET name = ?, category = ? WHERE id = ?",
      [material.name, material.category, id]
    );
    const after = { id, ...material };
    await registerLog(connection, logDetails(
      req, "edicao", "Material editado.", id, before, after, 200
    ));
    return after;
  });

  if (!updated) return res.status(404).json({ message: "Material nao encontrado." });
  res.json(updated);
}

// Exclui e registra o material antes de apagar seus dados.
export async function deleteMaterial(req, res) {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ message: "ID invalido." });
  }

  const deleted = await inTransaction(req.app.locals.db, async connection => {
    const [rows] = await connection.execute(
      "SELECT id, name, category FROM materials WHERE id = ? FOR UPDATE",
      [id]
    );
    const before = rows[0];
    if (!before) 
      return false;

    await connection.execute("DELETE FROM materials WHERE id = ?", [id]);
    await registerLog(connection, logDetails(
      req, "exclusao", "Material excluido.", id, before, null, 204
    ));
    return true;
  });

  if (!deleted) return res.status(404).json({ message: "Material nao encontrado." });
  res.status(204).end();
}
