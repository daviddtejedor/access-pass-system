FROM node:22-alpine

WORKDIR /app

# Copiamos manifests para aprovechar cache
COPY package*.json ./

RUN npm install

# Copiamos codigo y compilamos a JS
COPY . .
RUN npm run build

EXPOSE 3000

# En produccion corre directamente el codigo compilado en dist/
CMD ["npm", "start"]