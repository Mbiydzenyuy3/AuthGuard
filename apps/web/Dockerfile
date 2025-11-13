# -----------------------------
# Stage 1: Builder
# -----------------------------
FROM node:20-alpine AS builder

# Install basic tools
RUN apk add --no-cache bash git

WORKDIR /usr/src/app

# Copy root files first for pnpm install
COPY ../../package.json ../../pnpm-lock.yaml ./

# Install pnpm and all dependencies (including dev)
RUN npm install -g pnpm \
    && pnpm install

# Copy full monorepo
COPY ../../ ./

# Build the monorepo
RUN pnpm build

# -----------------------------
# Stage 2: Runner (Production)
# -----------------------------
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy production dependencies only
COPY ../../package.json ../../pnpm-lock.yaml ./
RUN PNPM_SKIP_HOOKS=1 pnpm install --prod

# Copy build output from builder
COPY --from=builder /usr/src/app/apps/web/.next ./.next
COPY --from=builder /usr/src/app/apps/web/public ./public

EXPOSE 3000

CMD ["pnpm", "start"]
