FROM node:lts-alpine as builder

WORKDIR /app

COPY pack*.json ./ 
COPY tsconfig.app.json tsconfig.app.json
COPY vite.config.ts vite.config.ts
COPY index.html index.html
COPY src src
COPY public public

# Génère le dossier node_modules
RUN npm i

ARG VITE_PUBLIC_API_LINK

ENV VITE_PUBLIC_API_LINK=${VITE_PUBLIC_API_LINK}

# Génère le dossier dist
RUN npm run build

FROM node:lts-alpine

WORKDIR /app

# Copier les dossiers à partir de l'image précédente
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/public /app/public
COPY --from=builder /app/.vite /app/.vite

RUN npm i --production

CMD npm start
