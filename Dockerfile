# Git info stage
FROM alpine/git:2.49.0 as git-info
WORKDIR /app
COPY . .
COPY .git ./.git

RUN \
  VITE_GIT_SHA="$(git rev-parse HEAD)" && \
  VITE_GIT_BRANCH="$(git rev-parse --abbrev-ref HEAD)" && \
  GIT_STATUS="$(git status --porcelain)" && \
  VITE_GIT_CLEAN="$( [ -z "$GIT_STATUS" ] && echo 'true' || echo 'false' )" && \
  echo "export VITE_GIT_SHA=$VITE_GIT_SHA" >> /tmp/git_vars && \
  echo "export VITE_GIT_BRANCH=$VITE_GIT_BRANCH" >> /tmp/git_vars && \
  echo "export VITE_GIT_CLEAN=$VITE_GIT_CLEAN" >> /tmp/git_vars

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

# Copy git info from previous stage
COPY --from=git-info /tmp/git_vars /tmp/git_vars

# Source the env vars and build
SHELL ["/bin/bash", "-c"]
RUN source /tmp/git_vars && npm run build

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
