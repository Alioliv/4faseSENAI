import { PrismaClient } from '@prisma/client'

// Instância única e compartilhada — evita abrir uma conexão nova
// com o MySQL a cada requisição. É a única peça do projeto que sabe
// que existe um banco MySQL do outro lado; routes e controllers
// nunca importam isso diretamente, só os services.
const prisma = new PrismaClient()

export default prisma
