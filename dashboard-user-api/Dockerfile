# Use uma imagem base com Node.js
FROM node

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos package.json e package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código
COPY . .

# Remova a pasta node_modules para garantir a recompilação
RUN rm -rf node_modules

# Reinstale todas as dependências e recompile bcrypt
RUN npm install
RUN npm rebuild bcrypt --build-from-source

# Compile o TypeScript
RUN npm run build

# Exponha a porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]
