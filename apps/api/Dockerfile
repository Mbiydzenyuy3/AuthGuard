# apps/api/Dockerfile

# Stage 1: Builder
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm @nestjs/cli turbo

# Copy all files (for monorepo install)
COPY . .

# Install dependencies across the whole monorepo
RUN pnpm install --frozen-lockfile

# Build only the API project (within monorepo)
RUN pnpm turbo run build --filter=api...

# Stage 2: Runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Copy the built output from the builder stage
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expose the API port
EXPOSE 3000

# Run the app
CMD ["node", "dist/main.js"]
