import crypto from 'crypto';

const chave = () => Buffer.from(process.env.CPF_KEY as string, 'hex');

export function criptografar(texto: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', chave(), iv);
  const enc = Buffer.concat([cipher.update(texto, 'utf8'), cipher.final()]);
  return [iv.toString('hex'), cipher.getAuthTag().toString('hex'), enc.toString('hex')].join(':');
}

export function descriptografar(valor: string): string {
  const [iv, tag, enc] = valor.split(':');
  const decipher = crypto.createDecipheriv('aes-256-gcm', chave(), Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(tag, 'hex'));
  return Buffer.concat([decipher.update(Buffer.from(enc, 'hex')), decipher.final()]).toString('utf8');
}
