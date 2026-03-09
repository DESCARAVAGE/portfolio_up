FROM node:lts-alpine as builder

WORKDIR /app

COPY pack*.json ./
COPY vite.config.ts vite.config.ts
COPY src src
COPY public public

# Génère le dossier node_modules
RUN npm ci

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Copier les dossiers à partir de l'image précédente
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN chmod -R 755 /usr/share/nginx/html

# COPY --from=builder /app/package.json /app/package.json
# COPY --from=builder /app/public /app/public

# RUN i --production

# CMD npm run build