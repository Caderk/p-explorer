#!/bin/sh

# Start PostgreSQL in the background
docker-entrypoint.sh postgres &

# Wait for PostgreSQL to become available
until pg_isready -h localhost -p $PGPORT -U $POSTGRES_USER; do
  echo "Waiting for PostgreSQL to start..."
  sleep 2
done

echo "PostgreSQL started. Running the Pokémon seeder..."

# Run the Python seeder script
/venv/bin/python3 /docker-entrypoint-initdb.d/seed_pokemon.py

# Keep PostgreSQL running in the foreground
wait
