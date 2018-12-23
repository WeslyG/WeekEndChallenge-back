FROM node:10-alpine

ENV NODE_ENV production
RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json /usr/app
COPY npm-shrinkwrap.json /usr/app

RUN apk add --no-cache --virtual .build-deps make gcc g++ python \
    && npm install --production --silent \
    && apk del .build-deps

COPY ./dist /usr/app/dist

EXPOSE 3000
CMD ["npm", "start"]
