FROM node:15

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY . .
RUN mkdir -p /logs
RUN touch /logs/errors.log
RUN touch /logs/exceptions.log

ARG DOCKER_ENV
ENV NODE_ENV=${DOCKER_ENV}

RUN npm run build
RUN node dist/server.js