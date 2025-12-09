FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=3003
ENV JWT_SECRET=dev-secret-key

EXPOSE 3003

CMD ["node", "server.js"]