"use client";

import { useEffect, useState, type FormEvent } from "react";
import { errorMessage } from "../services/api";
import { add, deleteMaterial, edit, getMaterials, type Material } from "../services/materials";
import type { Session } from "../services/login";
import Log from "./Log";

type Props = { session: Session; onLogout: () => void };

export default function Home({ session, onLogout }: Props) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [revision, setRevision] = useState(0);
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [showLogs, setShowLogs] = useState(false);
  const isAdmin = session.user.role === "admin";

  // Busca os materiais ao entrar e quando o usuario escolhe atualizar.
  useEffect(() => {
    let active = true;
    async function loadMaterials() {
      try {
        // O servico consulta a API; a Home atualiza a lista da tela.
        const data = await getMaterials(session);
        if (active) setMaterials(data);
      } catch (requestError) {
        if (active) setError(errorMessage(requestError));
      } finally {
        if (active) setLoading(false);
      }
    }
    loadMaterials();
    return () => { active = false; };
  }, [session, revision]);

  // Recarrega a lista depois de uma mudanca ou por pedido do usuario.
  function refresh() {
    setLoading(true);
    setError("");
    setNotice("");
    setRevision(current => current + 1);
  }

  // Abre o formulario vazio ou preenche os valores do material escolhido.
  function openForm(material?: Material) {
    setName(material?.name ?? "");
    setCategory(material?.category ?? "");
    setEditingId(material?.id ?? null);
    setFormMode(material ? "edit" : "create");
    setError("");
    setNotice("");
  }

  // Envia inclusao ou edicao; a API valida os campos e a permissao.
  async function saveMaterial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      // As chamadas HTTP ficam no servico materials.ts.
      const savedMaterial = formMode === "edit" && editingId !== null
        ? await edit(editingId, name, category, session)
        : await add(name, category, session);

      if (formMode === "edit") {
        setMaterials(current => current.map(item => item.id === savedMaterial.id ? savedMaterial : item));
        setNotice("Material atualizado.");
      } else {
        setMaterials(current => [...current, savedMaterial]);
        setNotice("Material adicionado.");
      }
      setFormMode(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  // Pede confirmacao antes de remover dados permanentes.
  async function remove(material: Material) {
    if (!window.confirm(`Excluir ${material.name} do banco de dados?`)) return;
    setDeleting(material.id);
    setError("");
    setNotice("");
    try {
      // A API valida o perfil e registra a acao no log antes de excluir.
      await deleteMaterial(material.id, session);
      setMaterials(current => current.filter(item => item.id !== material.id));
      setNotice(`${material.name} excluido.`);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setDeleting(null);
    }
  }

  // A pagina de auditoria e exclusiva para admin; a API tambem protege a rota.
  if (showLogs && isAdmin) {
    return <Log session={session} onBack={() => setShowLogs(false)} />;
  }

  return (
    <section className="panel" aria-labelledby="materials-title">
      <div className="actions">
        <p><strong>{session.user.name}</strong> · {session.user.email}</p>
        <button className="secondary" onClick={onLogout}>Sair</button>
      </div>
      <h1 id="materials-title">Materiais</h1>
      <p>Perfil: <strong>{isAdmin ? "Administrador (admin)" : "Usuario comum (user)"}</strong></p>
      <p>{isAdmin ? "Voce pode consultar e administrar materiais." : "Voce pode apenas consultar os materiais."}</p>
      <p className="muted">Para comparar os perfis, saia e entre com a outra conta.</p>
      <div className="actions">
        <button className="secondary" disabled={loading || saving || deleting !== null} onClick={refresh}>
          Atualizar materiais
        </button>
        {isAdmin ? (
          <>         
          <button disabled={loading || saving || deleting !== null} onClick={() => openForm()}>
            Adicionar material
          </button>   
            <button className="secondary" onClick={() => setShowLogs(true)}>
              Ver log de auditoria
            </button>
          </>
          
        ) :
        (
          <button disabled={loading || saving || deleting !== null} onClick={() => openForm()}>
            Adicionar material
          </button>
        )}
      </div>

      {formMode && (
        <form onSubmit={saveMaterial}>
          <h2>{formMode === "edit" ? "Editar material" : "Adicionar material"}</h2>
          <label htmlFor="material-name">Nome</label>
          <input id="material-name" required maxLength={150} disabled={saving}
            value={name} onChange={event => setName(event.target.value)} />
          <label htmlFor="material-category">Categoria</label>
          <input id="material-category" required maxLength={150} disabled={saving}
            value={category} onChange={event => setCategory(event.target.value)} />
          <div className="actions">
            <button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar material"}
            </button>
            <button type="button" className="secondary" disabled={saving} onClick={() => setFormMode(null)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {error && <p className="error" role="alert">{error}</p>}
      {notice && <p className="success" role="status">{notice}</p>}
      {loading ? (
        <p role="status">Carregando materiais...</p>
      ) : (
        <ul className="materials">
          {materials.map(material => (
            <li key={material.id}>
              <span><strong>{material.name}</strong> · {material.category}</span>
              {isAdmin ? (
                <span className="actions">
                  <button className="secondary" disabled={saving || deleting !== null}
                    onClick={() => openForm(material)}>Editar</button>
                  <button className="danger" disabled={saving || deleting !== null} onClick={() => remove(material)}>
                    {deleting === material.id ? "Excluindo..." : "Excluir"}
                  </button>
                </span>
              ) : (
                <span className="muted">Somente leitura</span>
              )}
            </li>
          ))}
        </ul>
      )}
      {!loading && !error && materials.length === 0 && <p>Nenhum material cadastrado.</p>}
    </section>
  );
}
