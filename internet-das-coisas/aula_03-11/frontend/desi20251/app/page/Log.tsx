'user client';

import { useEffect, useState } from 'react';
import type { Session } from '../services/login';
import { api, errorMessage } from '../services/api';

type AuditLog = {
    id: number;
    usuario: number | null;
    nome_usuario: string;
    datahora: string;
    acao: string;
    mensagem: string;
    recurso_afetado: string;
    id_recurso_afetado: number;
    campo_afetado: string;
    valor_antigo: string;
    valor_novo: string;
    ip: string;
    codigo_http: number; 
    status_acao: string;
}

type LogProps = { session: Session; onBack: () => void };

export default function Log({ session, onBack }: LogProps) {
    const [logs, setLogs] = useState<AuditLog[]>([]);  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
          async function loadLogs() {
        try {
            const response = await api.get<AuditLog[]>("/logs", {
                headers: {
                    Authorization: "Bearer " + session.token
                }
            });

            if (active)
                setLogs(response.data);

        } catch (requestError) {
            if (active)
                setError(errorMessage(requestError));

        } finally {
            if (active)
                setLoading(false);
        }
    }
    loadLogs();

    return () => { active = false;}; 

    }, [session.token]);

    return (
        <>
        <h1>Logs</h1>
        <p>Os ultimos 100 logs, do mais recente ao mais antigo</p>

        {error && <p>{error}</p>}
        {loading ? (
            <p>Carregando...</p>
        ) : logs.length === 0 ? (
            <p>Nenhum log encontrado.</p> ) : (

                <ol>
                    {logs.map(entry => (
                        <li key={entry.id}>
                            <h2>{entry.mensagem ?? entry.acao}</h2>
                            <p>
                                <strong>Data</strong> {new Date(entry.datahora).toLocaleString('pt-BR')}
                                &nbsp;
                                <strong> Usuário</strong> {entry.nome_usuario ?? entry.usuario ?? 'Desconhecido'}
                            </p>
                            <p>
                                <strong>ID</strong> {entry.id}
                                <strong>Ação</strong> {entry.acao ?? "_"}
                                <strong>Status</strong> {entry.status_acao ?? "_"}{entry.codigo_http ?? "_"}
                                <strong>Recurso Afetado</strong> {entry.recurso_afetado} ID: {entry.id_recurso_afetado ?? "_"}
                            </p>
                            <p>
                                <strong>IP</strong> {entry.ip ?? "_"}
                                <strong>Campo Afetado</strong> {entry.campo_afetado ?? "_"}
                                <strong>Valor Antigo</strong> {entry.valor_antigo ?? "_"}
                                <strong>Valor Novo</strong> {entry.valor_novo ?? "_"}
                            </p>
                        </li>
                    ))}

                </ol>
        )}
        </>
    );

}
