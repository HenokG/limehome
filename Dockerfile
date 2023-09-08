FROM node:19.3

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
