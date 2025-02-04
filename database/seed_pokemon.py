import requests
import psycopg2
import time

# Database connection details (use localhost since running inside the same container)
DB_CONFIG = {
    "dbname": "pokemon_db",
    "user": "pokemon_user",
    "password": "pokemon_pass",
    "host": "localhost",  # Database runs in the same container
    "port": "3011"
}

POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon?limit=50"  # Adjust as needed


def connect_db():
    """Establish connection to PostgreSQL with retries."""
    while True:
        try:
            conn = psycopg2.connect(**DB_CONFIG)
            return conn
        except psycopg2.OperationalError:
            print("Database not ready. Retrying in 5 seconds...")
            time.sleep(5)


def fetch_pokemon_list():
    """Fetch a list of Pokémon."""
    response = requests.get(POKEAPI_URL)
    if response.status_code == 200:
        return response.json().get("results", [])
    return []


def fetch_pokemon_details(url):
    """Fetch details of a single Pokémon."""
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    return None


def insert_pokemon_data():
    """Fetch and insert Pokémon data into the database."""
    conn = connect_db()
    cur = conn.cursor()

    pokemon_list = fetch_pokemon_list()

    for pokemon in pokemon_list:
        details = fetch_pokemon_details(pokemon["url"])
        if not details:
            continue

        pokemon_id = details["id"]
        name = details["name"]
        base_experience = details["base_experience"]
        height = details["height"]
        weight = details["weight"]
        sprite_url = details["sprites"]["front_default"]

        # Insert into pokemon table
        cur.execute(
            """
            INSERT INTO pokemon (pokemon_id, name, base_experience, height, weight, sprite_url)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (pokemon_id) DO NOTHING;
            """,
            (pokemon_id, name, base_experience, height, weight, sprite_url),
        )

        # Insert stats
        for stat in details["stats"]:
            stat_name = stat["stat"]["name"]
            base_stat = stat["base_stat"]
            effort = stat["effort"]

            cur.execute(
                """
                INSERT INTO stats (pokemon_id, stat_name, base_stat, effort)
                VALUES (%s, %s, %s, %s);
                """,
                (pokemon_id, stat_name, base_stat, effort),
            )

        # Insert types
        for type_info in details["types"]:
            type_name = type_info["type"]["name"]

            cur.execute(
                """
                INSERT INTO types (pokemon_id, type_name)
                VALUES (%s, %s);
                """,
                (pokemon_id, type_name),
            )

        print(f"Inserted data for {name}")

    conn.commit()
    cur.close()
    conn.close()
    print("Data insertion completed.")


if __name__ == "__main__":
    insert_pokemon_data()
