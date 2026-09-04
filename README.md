# pokedex

## Development Backend

The backend and PostgreSQL database can run together with Docker Compose.

### Quick Start

Start the backend and PostgreSQL:

```bash
make backend
```

In a second terminal, start the Expo app:

```bash
make app
```

If the database is empty, sync Pokemon data:

```bash
make sync
```

Check the backend health endpoint:

```bash
make health
```

Stop the backend and database:

```bash
make stop
```

### Database Persistence

PostgreSQL data is stored in the named Docker volume `postgres-data`, so it stays populated when you run:

```bash
make stop
```

The database is cleared if you remove the volume:

```bash
make reset
```

The database can also look empty if you switch between Docker PostgreSQL and a separate local Homebrew PostgreSQL instance, because those are different databases.

### Manual Commands

1. Copy the example environment file if you want to customize credentials:

```bash
cp .env.example .env
```

2. Start PostgreSQL and the Spring Boot backend:

```bash
docker compose up --build
```

3. Verify the backend is healthy:

```bash
curl http://localhost:8080/api/health
```

4. Sync Pokemon data from PokeAPI into PostgreSQL:

```bash
curl -X POST http://localhost:8080/api/pokemon/sync
```

5. Fetch Pokemon from the database-backed API:

```bash
curl http://localhost:8080/api/pokemon
```

Stop the containers with:

```bash
docker compose down
```

Remove the local database volume when you need a clean database:

```bash
docker compose down -v
```