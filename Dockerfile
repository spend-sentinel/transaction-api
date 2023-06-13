FROM node:alpine

WORKDIR /service

COPY package.json ./
RUN npm install
COPY src ./src

CMD ["node", "src/index.js"]