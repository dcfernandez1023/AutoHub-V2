# syntax=docker/dockerfile:1

########################################
# 1) Install deps (cached)
########################################
FROM node:20-alpine AS deps
WORKDIR /app

# Copy only manifests to leverage cache
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install deps for both workspaces
RUN npm --prefix server ci && npm --prefix client ci

########################################
# 2) Build client and server
########################################
FROM node:20-alpine AS build
WORKDIR /app

# Bring node_modules from deps
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY --from=deps /app/client/node_modules ./client/node_modules

# Copy sources
COPY server/ ./server/
COPY client/ ./client/

# Build client
RUN npm --prefix client run build

# Build server
RUN npm --prefix server run build

########################################
# 3) Runtime image
########################################
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Copy package and lock
COPY server/package*.json ./server/
# Copy prisma schema
COPY server/prisma ./server/prisma

# Install prod deps for server only
RUN npm --prefix server ci --omit=dev

# Copy server build (prefer dist/, else copy raw JS as fallback)
COPY --from=build /app/server/dist ./server/dist

# Copy client build into the path the server serves
COPY --from=build /app/client/build ./client/build

EXPOSE 5000

# Start the server
CMD ["node", "dist/index.js", "prod"]
WORKDIR /app/server
