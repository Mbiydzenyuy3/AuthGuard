FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY turbo.json ./
COPY tsconfig.json ./

COPY packages/ ./packages/
COPY apps/api/package.json ./apps/api/package.json

RUN pnpm install --frozen-lockfile

COPY apps/api/ ./apps/api/

RUN pnpm --filter api build

FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

RUN npm install -g pnpm

COPY package.json .
COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .

COPY packages/ ./packages/
COPY apps/api/package.json ./apps/api/package.json

RUN pnpm install --filter=api --prod --frozen-lockfile --ignore-scripts

COPY --from=builder /app/apps/api/dist ./apps/api/dist

WORKDIR /app/apps/api

EXPOSE 3000

CMD ["node", "dist/main.js"]