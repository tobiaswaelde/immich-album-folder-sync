FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN ["yarn", "install", "--production", "--frozen-lockfile"]

COPY . .

EXPOSE 3000
CMD ["yarn", "start"]