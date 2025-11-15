FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache bash

RUN npm install -g pnpm

COPY apps/api/package.json ./package.json
COPY apps/api/src ./src

RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY . .

RUN pnpm -w turbo run build --filter ./apps/api...

FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=base /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main.js"]
