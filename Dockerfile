# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy rest of application
COPY . .

# Build Next.js app (no Directus access needed - pages generated on-demand)
# Provide placeholder env vars for build (real values provided at runtime via docker-compose)
# Note: DIRECTUS_TOKEN is a non-sensitive placeholder - actual token set at runtime
ENV NEXT_PUBLIC_DIRECTUS_URL=https://cms.dewbob.com
ENV DIRECTUS_TOKEN=build-placeholder-not-used

RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install curl and wget for health checks
RUN apk add --no-cache curl wget

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Create cache directory and set ownership
RUN mkdir -p .next/cache && \
    chown -R nextjs:nodejs /app/.next && \
    chown -R nextjs:nodejs /app

# Create /opt/dewbob directory (for potential volume mounting)
RUN mkdir -p /opt/dewbob && chown nextjs:nodejs /opt/dewbob

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
