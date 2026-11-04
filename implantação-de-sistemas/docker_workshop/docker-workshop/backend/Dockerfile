# imagem que vem do node, versão 20, baseada em alpine do linox
FROM node:20-alpine

# define a pasta onde o Docker vai trabalhar dentro da imagem.
WORKDIR /app

# copia os arquivos package.json e package-lock.json para dentro da imagem.
COPY package*.json ./

RUN npm install

# copia todos os arquivos do projeto para dentro da imagem.
COPY . .

# documenta que o container escuta na porta 8000
EXPOSE 8000 

# define o comando que será executado quando o container for iniciado.
CMD ["npm", "start"]
