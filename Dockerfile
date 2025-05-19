# ####################
# INSTALL
# ####################
# install dependencies
FROM node:lts-alpine AS deps
RUN apk add --no-cache libc6-compat
RUN apk add yarn
WORKDIR /app
RUN ["yarn", "install", "--frozen-lockfile"]



# ####################
# BUILD
# ####################
# build image
FROM node:lts-alpine AS builder
RUN apk add yarn
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN ["yarn", "install", "--ignore-scripts", "--prefer-offline"]
RUN ["yarn", "build"] 



# ####################
# RUN
# ####################
# production image, copy all the files and run next
FROM node:lts-alpine as runner
RUN apk add curl
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/. .
COPY README.md .

RUN apk add --no-cache --upgrade bash


CMD ["yarn", "start"]