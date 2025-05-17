# Pathways-based transition assessment repository (pbtar)

[![Test DB service](https://github.com/RMI/pbtar/actions/workflows/db-test.yml/badge.svg)](https://github.com/RMI/pbtar/actions/workflows/db-test.yml)
[![Test Status](https://github.com/RMI/pbtar/actions/workflows/api-test.yml/badge.svg?branch=main)](https://github.com/RMI/pbtar/actions/workflows/api-test.yml)
[![Lint](https://github.com/RMI/pbtar/actions/workflows/api-lint.yml/badge.svg?branch=main)](https://github.com/RMI/pbtar/actions/workflows/api-lint.yml)
[![Test service integration](https://github.com/RMI/pbtar/actions/workflows/integration-test.yml/badge.svg)](https://github.com/RMI/pbtar/actions/workflows/integration-test.yml)
[![Docker](https://github.com/RMI/pbtar/actions/workflows/api-docker-build-and-push.yml/badge.svg?branch=main)](https://github.com/RMI/pbtar/actions/workflows/api-docker-build-and-push.yml)

## Running the API

### Setup

1. Clone the Repo

```sh
git clone https://github.com/RMI/pbtar
cd pbtar
```

2. Create an `.env` file to store the desired API key, (internal) API port, and DB port
```sh
echo -e "API_KEY=abc123\nAPI_PORT=8080\nDB_PORT=5432" > .env
```

### Run the services with docker compose

```sh
# build the image
docker compose build

# run the container
docker compose up --detach

# do both
docker compose up --detach --build
```

The API will be accessible at http://localhost.

### Make a request from the API

```sh
curl -X 'GET' \
  'http://localhost/scenarios' \
  -H 'accept: application/json' \
  -H 'X-API-Key: abc123'
```

### Load a minimal frontend index.html file to test

Defaults to the API key "abc123", but an alternate key (matching what is in your `.env` file) can be input and submitted on the page.

```sh
open frontend/index.html
```

### Shutdown the docker container

```sh
docker compose down

# also delete the database volume when shutting down the container
docker compose down --volumes
```

## License
 This project is licensed under the [MIT License](LICENSE.txt) 
