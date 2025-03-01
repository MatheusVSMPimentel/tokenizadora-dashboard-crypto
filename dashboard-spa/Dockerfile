FROM node AS builder
# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos de dependências para otimizar o cache
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o código fonte para o container
COPY . .

# Executa o comando de build (ajuste "npm run build" conforme seu script de build)
RUN npm run build

# Etapa 2: Servidor - usa Nginx para servir os arquivos estáticos
FROM nginx:stable

# Copia os arquivos compilados (geralmente na pasta dist) para a pasta padrão do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta que o Nginx usará (80 por padrão)
EXPOSE 80

# Inicia o Nginx em modo foreground
CMD ["nginx", "-g", "daemon off;"]