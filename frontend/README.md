# Pathways-based transition assessment repository (pbtar) - Frontend service

This directory (`frontend`) contains the frontend service for the Pathways-based transition assessment repository (pbtar).

NOTE: All commands in this README are written with the assumption that the working directory is `frontend`, e.g. you have used `cd frontend` from the root directory of the pbtar repo, so that the context is exclusive to the Frontend service.

## Set-Up
This project uses Node.js and npm for dependency management.

To install Node.js, follow the [official installation guide](https://nodejs.org/en/download/).

1. Clone the Repo
``` bash
git clone https://github.com/your-username/pbtar.git
cd pbtar/frontend
```

2. Install Dependencies
``` bash
npm install
```

3. Running the Frontend
You can locally service the frontend *alone* with:
``` bash
npm run dev # which calls vite
```

The local development service will be accessible at `http://localhost:3000`. It automatically reloads on file changes.

3a. Running all services together
If you want to run the frontend alongside the backend and database, you can use Docker Compose. Make sure you have Docker installed, then run:
``` bash
docker-compose up --build
```

This will start all services defined in the `docker-compose.yml` file, including the frontend, backend, and database. The frontend will be accessible at `http://localhost:3000`.

## Contributing
Dependencies are managed using `npm`. To add a new library, run: 
``` bash
npm install <library> # for runtime dependencies
npm install --save-dev <library> # for development dependencies
```

## Testing
Coming soon... (likely using vitest)

## Linting and Formatting
Coming soon... (likely eslint and prettier)

## License
This project is licensed under the MIT License - see the LICENSE file at the project root for details.