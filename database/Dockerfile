# Use the official PostgreSQL image
FROM postgres:15-alpine

# Install Python and create virtual environment
RUN apk add --no-cache python3 py3-pip && \
    python3 -m venv /venv && \
    /venv/bin/pip install requests psycopg2-binary

# Set environment variables for PostgreSQL
ENV POSTGRES_DB=pokemon_db
ENV POSTGRES_USER=pokemon_user
ENV POSTGRES_PASSWORD=pokemon_pass
ENV PGPORT=3011

# Copy initialization script and seeder
COPY init.sql /docker-entrypoint-initdb.d/
COPY seed_pokemon.py /docker-entrypoint-initdb.d/

# Ensure seeder script is executable
RUN chmod +x /docker-entrypoint-initdb.d/seed_pokemon.py

# Set up a script to start PostgreSQL and run the seeder
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Default command: Start PostgreSQL and run the seeder
CMD ["/entrypoint.sh"]
