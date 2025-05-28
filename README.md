# Pathways-based transition assessment repository (pbtar)

[![Lint Frontend service](https://github.com/RMI/pbtar/actions/workflows/frontend-lint.yml/badge.svg?branch=main)](https://github.com/RMI/pbtar/actions/workflows/frontend-lint.yml)
[![Test Frontend service](https://github.com/RMI/pbtar/actions/workflows/frontend-test.yml/badge.svg?branch=main)](https://github.com/RMI/pbtar/actions/workflows/frontend-test.yml)

## Running the application

1. Clone the Repo

```sh
git clone https://github.com/RMI/pbtar
cd pbtar
```

2. Create an `.env` file to store the desired frontend port

```sh
cp .env.example .env
```

3. Run the services with `docker compose`

```sh
# build the image
docker compose build

# run the container
docker compose up --detach

# do both
docker compose up --detach --build
```

The React web service will be accessible at http://localhost.

4. Shutdown the docker container

```sh
docker compose down
```

## Development

### Set-Up

This project uses Node.js and npm for dependency management.

To install Node.js, follow the [official installation guide](https://nodejs.org/en/download/).

1. Install Dependencies

```bash
cd pbtar
npm install
```

2. Running the Frontend
   You can locally serve the frontend _alone_ with:

```bash
npm run dev
```

The local development service will be accessible at `http://localhost:3000`. It automatically reloads on file changes.

3. Running with `docker compose`
   If you prefer to run the entire application stack using Docker, you can use the following command:

```bash
docker compose up --build
```

This will start all services defined in the `docker-compose.yml` file, including the frontend, backend, and database. The frontend will be accessible at `http://localhost`.

## Contributing

Dependencies are managed using `npm`. To add a new library, run:

```bash
npm install <library> # for runtime dependencies
npm install --save-dev <library> # for development dependencies
```

## Testing

This project uses Vitest for unit testing. To run the tests, use:

```bash
npm run test
```

## Linting and Formatting

This project uses ESLint and Prettier for code consistency:

```bash
# Check code for issues
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format
```

## License

This project is licensed under the [MIT License](LICENSE.txt)
