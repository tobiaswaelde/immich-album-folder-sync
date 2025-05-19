FROM node:22-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY yarn.lock ./
RUN ["yarn", "install", "--frozen-lockfile"]

# Copy the rest of the application code
COPY . .

# Build the application
RUN ["yarn", "build"]

# Set environment variables
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]