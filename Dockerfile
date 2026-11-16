### ####################
### BUILDER
### ####################
FROM node:lts-alpine AS builder

# set working directory
WORKDIR /app

# install app dependencies
RUN npm install --global yarn@1.22.22
COPY package.json yarn.lock ./
RUN ["yarn", "install", "--frozen-lockfile"]

# build app
COPY . /app
RUN ["yarn", "build"]



### ####################
### RUNNER
### ####################
FROM node:lts-alpine AS runner

# Apply Alpine security updates and install curl for the health check.
RUN apk upgrade --no-cache && apk add --no-cache curl
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# set working directory
WORKDIR /app

# copy compiled app from builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/build ./build

# export application port
ENV PORT=3001
EXPOSE $PORT

# enable health check
HEALTHCHECK CMD sh -c "curl -f http://localhost:$PORT/api/health || exit 1"

# start app
CMD ["node", "./build/index.js"]
