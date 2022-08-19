FROM node:16-alpine

RUN mkdir -p /home/node/app/node_modules \
    && chown -R node:node /home/node/app

WORKDIR /home/node/app

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

CMD ["node", "server.js"]