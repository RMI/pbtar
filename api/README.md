# Pathways-based transition assessment repository (pbtar) - API service

[![Test Status](https://github.com/RMI/pbtar/actions/workflows/api-test.yml/badge.svg?branch=main)](https://github.com/RMI/pbtar/actions/workflows/api-test.yml)
[![Docker](https://github.com/RMI/pbtar/actions/workflows/api-docker-build-and-push.yml/badge.svg?branch=main)](https://github.com/RMI/pbtar/actions/workflows/api-docker-build-and-push.yml)
[![Lint](https://github.com/RMI/pbtar/actions/workflows/api-lint.yml/badge.svg?branch=main)](https://github.com/RMI/pbtar/actions/workflows/api-lint.yml)

This directory (`api/`) contains the API service for the Pathways-based transition assessment repository (pbtar).

NOTE: All commands in this README are written with the assumption that the working directory is `api/`, e.g. you have used `cd api` from the root directory of the pbtar repo, so that the context is exclusive to the API service.

## Set-Up

### Prerequisites

This project uses [uv](https://github.com/astral-sh/uv) for environment and dependency management.

To install, follow the [official installation guide](https://github.com/astral-sh/uv?tab=readme-ov-file#installation).

### Setup

1. Clone the Repo

```sh
git clone https://github.com/RMI/pbtar
cd pbtar/api
```

2. Create and Activate the Virtual Environment

```sh
uv venv .venv
source .venv/bin/activate # macOS/Linux
```

3. Install Dependencies

```sh
uv sync
```

## Running the API

### Locally serve the Fast API with:

```sh
uv run main.py
```

### Run Fast API in docker container with: 

```sh
# build the image
docker build --tag api .

# run the container in the background
docker run --rm --detach --publish 127.0.0.1:80:5000 api
```

The API will be accessible at http://localhost.

## Contributing

### Dependency Management

Dependencies are managed using uv. To add a new library, run:

```sh
uv add <library>
```

### Testing
 
Testing is implemented using the `pytest` library. Run all tests locally with:

```sh
uv run pytest
```

Or, you can run specific test suites with:

```sh
uv run pytest tests/test_unit.py        # to only run unit tests
uv run pytest tests/test_integration.py # to only run integration tests
```

For test-only dependencies, add them using:

```sh
uv add --dev <library>
```

### Linting

This project follows the [black](https://github.com/psf/black) code formatting standard. Lint code by running:

```sh
uv run black path/to/file.py # to lint a single file
uv run black .               # to lint the entire directory
```

## License
 This project is licensed under the [MIT License](LICENSE.txt) 
