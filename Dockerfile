# Build stage
FROM node:24-slim AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:24-slim AS production

# Copy built assets from the build stage
COPY --from=build /app/dist /app/dist

# Copy Azure config file
COPY staticwebapp.config.json /app/dist

# Install Azure SWA CLI globally
RUN npm install -g @azure/static-web-apps-cli

# Start SWA CLI
CMD ["swa", "start", "app/dist", "--host", "0.0.0.0"]
