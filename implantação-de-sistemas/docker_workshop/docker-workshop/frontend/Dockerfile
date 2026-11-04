# imagem base com Node.js 20 sobre Alpine Linux
FROM node:20-alpine

# pasta de trabalho dentro da imagem
WORKDIR /app

# copia os arquivos de dependências primeiro, para aproveitar o cache
COPY package*.json ./

# instala as dependências dentro da imagem
RUN npm install

# copia o restante do código
COPY . .

# documenta que o container escuta na porta 3000
EXPOSE 3000

# comando executado quando o container iniciar
CMD ["npm", "run", "dev"]