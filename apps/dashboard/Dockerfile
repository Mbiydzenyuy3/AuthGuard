FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache bash
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/package.json

RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm -w turbo run build --filter ./apps/web...
RUN pnpm -w --filter ./apps/web... run export

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/apps/web/out ./out
EXPOSE 3000

