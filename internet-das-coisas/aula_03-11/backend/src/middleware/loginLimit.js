import { registerLoginLog } from "../controllers/log.js";

const attempts = new Map();
const waitTime = 3 * 60 * 1000; // 3 minutos em milissegundos.
const maxFailures = 5;

// Guarda as falhas por IP na memoria do servidor, para simplificar a aula.
// Reiniciar o servidor limpa os bloqueios.
export async function loginLimit(req, res, next) {
  const now = Date.now();

  // Remove registros vencidos para nao acumular IPs na memoria.
  for (const [ip, attempt] of attempts) {
    if (attempt.expiresAt <= now) attempts.delete(ip);
  }

  const attempt = attempts.get(req.ip);
  if (attempt?.failures >= maxFailures) {
    const seconds = Math.ceil((attempt.expiresAt - now) / 1000);
    // Arredonda para cima: enquanto houver tempo restante, mostra ao menos 1 minuto.
    const minutes = Math.ceil(seconds / 60);
    await registerLoginLog(req, 429, "bloqueado");
    res.set("Retry-After", String(seconds));
    return res.status(429).json({
      message: `Limite de tentativas atingido. Aguarde ${minutes} ${minutes === 1 ? "minuto" : "minutos"} para tentar novamente.`,
    });
  }

  // O controller chama esta funcao depois de verificar as credenciais.
  res.locals.recordLoginResult = success => {
    if (success) {
      attempts.delete(req.ip);
      return;
    }
    const current = attempts.get(req.ip) || { failures: 0 };
    current.failures += 1;
    // A quinta falha inicia um bloqueio de 3 minutos completos.
    current.expiresAt = Date.now() + waitTime;
    attempts.set(req.ip, current);
  };

  next();
}
