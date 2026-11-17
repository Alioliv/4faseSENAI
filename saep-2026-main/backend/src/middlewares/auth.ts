import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ mensagem: 'Não autenticado' });
    return;
  }
  try {
    res.locals.usuario = jwt.verify(token, process.env.JWT_SECRET as string);
    next();
  } catch {
    res.status(401).json({ mensagem: 'Sessão expirada. Faça login novamente.' });
  }
}

