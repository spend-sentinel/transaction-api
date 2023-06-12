FROM node:alpine

WORKDIR /service

COPY src ./src
COPY package.json data.json ./
RUN npm install

CMD ["node", "src/index.js"]