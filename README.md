# Pathways-based transition assessment repository (pbtar)

[![Lint Frontend service](https://github.com/RMI/pbtar/actions/workflows/frontend-lint.yml/badge.svg?branch=main)](https://github.com/RMI/pbtar/actions/workflows/frontend-lint.yml)
[![Test Frontend service](https://github.com/RMI/pbtar/actions/workflows/frontend-test.yml/badge.svg?branch=main)](https://github.com/RMI/pbtar/actions/workflows/frontend-test.yml)

## Running the application

### Setup

1. Clone the Repo

```sh
git clone https://github.com/RMI/pbtar
cd pbtar
```

2. Create an `.env` file to store the desired API key, (internal) API port, DB port and Frontend port
```sh
cp .env.example .env
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

The primary web service (React) will be accessible at http://localhost.

### Shutdown the docker container

```sh
docker compose down
```

## License
 This project is licensed under the [MIT License](LICENSE.txt) 
