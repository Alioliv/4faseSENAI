import { api } from "./api";
import type { Session } from "./login";

// Mesmo formato de material usado pela API e pela Home.
export type Material = { id: number; name: string; category: string };

// Criar: envia os campos e o token do usuario autenticado.
export async function add(name: string, category: string, session: Session) {
  const response = await api.post<Material>("/materials",
     { name, category 
},{
    headers: {
      Authorization: "Bearer " + session.token
    }
    });
    return response.data;

}
// Editar: o ID na URL indica qual material sera atualizado.
export async function edit(id: number, name: string, category: string, session: Session) {
  const response = await api.put<Material>(`/materials/${id}`, 
    { name, category }, {
    headers: {
      Authorization: "Bearer " + session.token
    }
  });
  return response.data;
}



// Excluir: a API responde com 204, sem corpo de resposta.
export async function deleteMaterial(id: number, session: Session) {
  await api.delete(`/materials/${id}`, {
    headers: {
      Authorization: "Bearer " + session.token
    }
  });
}

// Consultar: retorna a lista para a Home exibir.
export async function getMaterials(session: Session) {
  const response = await api.get<Material[]>("/materials", {
    headers: {
      Authorization: "Bearer " + session.token
    }
  });
  return response.data;
}

