# CIPTEA Digital — imagem para Hugging Face Spaces (Docker) ou qualquer host de containers
FROM node:20-bookworm-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV SESSION_SECRET=build-time-placeholder-not-used-at-runtime-0000000000
RUN npx next build

FROM node:20-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=7860
ENV HOSTNAME=0.0.0.0
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
# better-sqlite3 nativo já compilado no builder
COPY --from=builder /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3
RUN mkdir -p uploads && chown -R node:node /app
USER node
EXPOSE 7860
CMD ["node", "server.js"]
