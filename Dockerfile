FROM node:carbon-alpine

# Create app directory
WORKDIR /usr/src/app

ENV PORT=3000

COPY package.json .

RUN apk add --no-cache --virtual .build-deps make gcc g++ python \
 && npm install --production --silent \
 && apk del .build-deps
 
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]