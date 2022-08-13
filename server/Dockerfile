FROM node:16-alpine

RUN mkdir -p /home/node/app/node_modules \
    && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN chown -R node:node ./

USER node
RUN npm install

COPY --chown=node:node . .

ENV _APP_PORT=8080 \
    _APP_ENV=production \
    _APP_REDIS_URL=redis://redis:6379

EXPOSE 8000

CMD ["node", "server.js"]