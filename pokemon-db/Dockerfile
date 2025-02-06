# Use the official PostgreSQL image
FROM postgres:latest

# Remove or comment out this line since we want to use the default port
# ENV PGPORT=3011

# Copy the initialization SQL script into the container
COPY init.sql /docker-entrypoint-initdb.d/

# Expose the default PostgreSQL port (optional)
EXPOSE 5432
