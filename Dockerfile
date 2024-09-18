FROM node:20-alpine AS base
WORKDIR /service

FROM base AS dependencies
COPY package.json yarn.lock tsconfig.json ./
RUN yarn --pure-lockfile --production true

FROM dependencies AS build
RUN yarn --pure-lockfile --production false
COPY src ./src

RUN yarn build

FROM base AS release
COPY --from=dependencies /service/node_modules ./node_modules
COPY --from=dependencies /service/package.json ./package.json
COPY --from=build /service/dist ./dist

ENV NODE_ENV=production

CMD [ "node", "dist/index.js" ]