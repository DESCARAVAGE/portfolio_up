# Image de production du portfolio Next.js (sortie standalone).
# Le serveur écoute sur 8080 : c'est le port vers lequel nginx.conf envoie "/".

FROM node:24-alpine AS builder

WORKDIR /app

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    NEXT_TELEMETRY_DISABLED=1

# pnpm à la version déclarée dans package.json ("packageManager")
RUN corepack enable

# Dépendances d'abord, pour profiter du cache Docker tant que le lockfile ne change pas
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

# Adresse publique : lue au build pour l'URL canonique, l'Open Graph et le sitemap
ARG NEXT_PUBLIC_SITE_URL=https://www.dany-sk-fsp.com
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

RUN pnpm build


FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=8080 \
    HOSTNAME=0.0.0.0

# Serveur minimal + fichiers statiques (non copiés automatiquement par Next)
COPY --from=builder --chown=1000:1000 /app/.next/standalone ./
COPY --from=builder --chown=1000:1000 /app/.next/static ./.next/static
COPY --from=builder --chown=1000:1000 /app/public ./public

USER 1000

EXPOSE 8080

CMD ["node", "server.js"]