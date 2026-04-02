FROM node:25-alpine AS builder

WORKDIR /app

# Copy package files and install ALL dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
COPY storage ./storage

# Build TypeScript to JavaScript
RUN npm run build

FROM node:25-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

# Install ONLY production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

USER node

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/storage ./storage

EXPOSE 3000

RUN deluser --remove-home node

ENTRYPOINT ["npm", "run", "start"]