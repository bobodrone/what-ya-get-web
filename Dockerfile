# ---- Build stage ----
# Compile the SvelteKit app (needs devDependencies like vite/svelte).
FROM node:24-alpine AS builder

WORKDIR /app

# Copy only package files first so this layer is cached until deps change.
COPY package*.json ./

# Install all dependencies (dev included — required to build).
RUN npm ci

# Now copy the rest of the app and build it (adapter-node -> ./build).
COPY . .
RUN npm run build

# ---- Runtime stage ----
# Ship only the built output and production dependencies.
FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production

# Production-only dependencies.
COPY package*.json ./
RUN npm ci --omit=dev

# The compiled server from the build stage.
COPY --from=builder /app/build ./build

# Document which port the app listens on (adapter-node honours $PORT).
EXPOSE 3000

# Command to run when the container starts.
CMD ["node", "build"]
