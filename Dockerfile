FROM node:10-alpine

COPY package*.json ./

RUN yarn install --production

COPY . .

USER node

CMD ["yarn", "start-prod"]