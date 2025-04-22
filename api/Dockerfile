# Stage 1: Get uv binary
FROM ghcr.io/astral-sh/uv:0.6.10 AS uv-builder

# Stage 2: Build the app
FROM python:3.12.6-slim

# Install uv
COPY --from=uv-builder  /uv /uvx /bin/

# Set the working directory
WORKDIR /app

# Copy dependenicy files
COPY pyproject.toml uv.lock ./

# Install dependencies (without installing project)
RUN uv sync --frozen --no-install-project

# Copy project source code
COPY src/ ./src/

RUN chmod -R a+w /app/src /app/.venv

# Copy main entrypoint
COPY main.py ./main.py

# Add non-root user
RUN useradd -m appuser
USER appuser

ENTRYPOINT ["uv"]
CMD ["run", "main.py"]
