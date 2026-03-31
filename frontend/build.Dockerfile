FROM node:25-alpine AS builder

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json vite.config.ts ./

RUN npm ci --ignore-scripts

COPY index.html index.html
COPY src src
COPY public public

# # Génère le dossier node_modules
# RUN npm i

ARG VITE_PUBLIC_API_LINK

ENV VITE_PUBLIC_API_LINK=${VITE_PUBLIC_API_LINK}


# Génère le dossier dist
RUN npm run build

FROM nginx:alpine AS production

# Config nginx custom (optionnel)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# FROM node:lts-alpine

# WORKDIR /app

# # Copier les dossiers à partir de l'image précédente
# COPY --from=builder /app/package.json /app/package.json
# COPY --from=builder /app/public /app/public
# # COPY --from=builder /app/.vite /app/.vite

# RUN npm i --production

# ENTRYPOINT [ "npm" ,"run", "dev" ]
