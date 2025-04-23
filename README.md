# Pathways-based transition assessment repository (pbtar)

[![Test Status](https://github.com/RMI/pbtar/actions/workflows/api-test.yml/badge.svg?branch=main)](https://github.com/RMI/pbtar/actions/workflows/api-test.yml)
[![Docker](https://github.com/RMI/pbtar/actions/workflows/api-docker-build-and-push.yml/badge.svg?branch=main)](https://github.com/RMI/pbtar/actions/workflows/api-docker-build-and-push.yml)
[![Lint](https://github.com/RMI/pbtar/actions/workflows/api-lint.yml/badge.svg?branch=main)](https://github.com/RMI/pbtar/actions/workflows/api-lint.yml)

## Running the API

### Setup

1. Clone the Repo

```sh
git clone https://github.com/RMI/pbtar
cd pbtar
```

2. Create an `.env` file to store the desired API key
```sh
echo "API_KEY=abc123" > .env
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
  'http://localhost/api/dataset' \
  -H 'accept: application/json' \
  -H 'X-API-Key: abc123'
```

### Shutdown the docker container

```sh
docker compose down
```

## License
 This project is licensed under the [MIT License](LICENSE.txt) 
