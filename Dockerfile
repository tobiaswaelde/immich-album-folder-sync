FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
RUN ["yarn", "install", "--production", "--frozen-lockfile"]

COPY . .

RUN ["yarn", "build"]

EXPOSE 3000
CMD ["yarn", "start"]