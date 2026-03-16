FROM node:lts-alpine AS builder

WORKDIR /app
COPY package.json ./
COPY tsconfig.json tsconfig.json
COPY src src

# Génère le dossier node_modules
RUN npm i

# Génère le dossier dist
RUN npm run build

FROM node:lts-alpine

WORKDIR /app

# Copier les dossiers à partir de l'image précédente
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json
# COPY --from=builder /app/build /app

RUN npm i --production

ENTRYPOINT [ "npm", "start" ]