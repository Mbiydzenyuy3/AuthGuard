FROM node:20-alpine AS builder

RUN apk add --no-cache bash git

WORKDIR /usr/src/app

COPY ../../package.json ../../pnpm-lock.yaml ./

RUN npm install -g pnpm \
    && pnpm install

COPY ../../ ./

RUN pnpm build

FROM node:20-alpine AS runner

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY ../../package.json ../../pnpm-lock.yaml ./
RUN PNPM_SKIP_HOOKS=1 pnpm install --prod

COPY --from=builder /usr/src/app/apps/web/.next ./.next
COPY --from=builder /usr/src/app/apps/web/public ./public

EXPOSE 3000

CMD ["pnpm", "start"]
