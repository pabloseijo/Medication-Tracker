# Usa la imagen oficial de Node.js
FROM node:20

# Establece el directorio de trabajo
WORKDIR /app

COPY package*.json ./

# Instala Expo CLI globalmente
RUN npm install 

# Copia todo el código fuente
COPY . .

# Expone los puertos necesarios para Expo
EXPOSE 8081

# Comando para iniciar el servidor de desarrollo de Expo
CMD ["npx", "expo", "start"]