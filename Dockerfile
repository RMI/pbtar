# Git info stage
FROM alpine/git:2.49.0 as git-info
WORKDIR /app
COPY .git ./.git
RUN git rev-parse HEAD > /tmp/git_sha && \
    git rev-parse --abbrev-ref HEAD > /tmp/git_branch && \
    git status --porcelain > /tmp/git_status

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
COPY --from=git-info /tmp/git_sha /tmp/git_sha
COPY --from=git-info /tmp/git_branch /tmp/git_branch
COPY --from=git-info /tmp/git_status /tmp/git_status

# Set git info as env vars
RUN echo "export VITE_GIT_SHA=$(cat git_sha)" >> /tmp/git_profile && \
    echo "export VITE_GIT_BRANCH=$(cat git_branch)" >> /tmp/git_profile && \
    echo "export VITE_GIT_CLEAN=$([ ! -s git_status ] && echo 'true' || echo 'false')" >> /tmp/git_profile

# Source the env vars and build
SHELL ["/bin/bash", "-c"]
RUN source /tmp/git_profile && npm run build

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
