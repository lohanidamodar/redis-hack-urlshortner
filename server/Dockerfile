FROM node:16-alpine

RUN mkdir -p /home/node/server/node_modules \
    && chown -R node:node /home/node/server

WORKDIR /home/node/server

COPY package*.json ./

RUN chown -R node:node ./

USER node
RUN npm install

COPY --chown=node:node . .

ENV APP_PORT=8000 \
    APP_ENV=production \
    APP_REDIS_URL=redis://redis:6379 \
    APP_BASE_URL=http://localhost

EXPOSE 8000

CMD ["node", "app/server.js"]