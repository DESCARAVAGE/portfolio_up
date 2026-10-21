FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files and install ALL dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm ci --ignore-scripts

# Copy source and build
COPY tsconfig*.json ./
COPY src ./src

# Build TypeScript to JavaScript
RUN npm run build

FROM node:24-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

# Install ONLY production dependencies
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts



# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Le CV n'est PAS dans l'image (elle est publique sur Docker Hub) : storage/ est
# monté depuis le serveur, en lecture seule (voir docker-compose.prod.yml).
RUN mkdir -p storage && chown 1000:1000 storage

EXPOSE 3000

USER 1000

ENTRYPOINT ["npm", "run", "start"]