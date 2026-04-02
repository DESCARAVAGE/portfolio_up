FROM node:25-alpine AS builder

WORKDIR /app

# Copy package files and install ALL dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm ci

# Copy source files
COPY tsconfig*.json vite.config.ts ./
COPY index.html ./
COPY src ./src
COPY public ./public

# Build args
ARG VITE_PUBLIC_API_LINK
ENV VITE_PUBLIC_API_LINK=${VITE_PUBLIC_API_LINK}

# Build the app
RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine AS production

# Copy built static files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]