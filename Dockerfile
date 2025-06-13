# Build stage
FROM node:24-slim AS build

# Set working directory
WORKDIR /app

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
   git=1:2.39.* \
 && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

RUN npm run build

# Production stage
FROM node:24-slim AS production

# Install Azure SWA CLI globally
RUN npm install -g \
      @azure/static-web-apps-cli@2.0.6

# Copy Azure config file
COPY staticwebapp.config.json /app/dist/

# Copy built assets from the build stage
COPY --from=build /app/dist /app/dist/

# Start SWA CLI
CMD ["swa", "start", "app/dist", "--host", "0.0.0.0"]
