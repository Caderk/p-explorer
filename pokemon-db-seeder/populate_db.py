import os
import time
import requests
import psycopg2

print("Starting population script...")

# Read connection info from environment variables.
DB_HOST = os.environ.get("DB_HOST", "pokemon-db")
DB_DATABASE = os.environ.get("DB_DATABASE", "pokemon_db")
DB_USER = os.environ.get("DB_USER", "pokemon_user")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "pokemon_pass")


# Function to fetch a page of Pokémon from the API.
def fetch_pokemon_page(api_url):
    response = requests.get(api_url)
    response.raise_for_status()
    return response.json()


# Function to fetch the detailed data of a single Pokémon.
def fetch_pokemon_details(url):
    response = requests.get(url)
    response.raise_for_status()
    return response.json()


def main():
    # --- Database Connection ---
    # The populate container should use the 'db' service hostname.
    connected = False
    while not connected:
        try:
            conn = psycopg2.connect(
                host=DB_HOST, database=DB_DATABASE, user=DB_USER, password=DB_PASSWORD
            )
            connected = True
        except Exception as e:
            print("Database not ready, waiting 2 seconds...")
            time.sleep(2)
    cursor = conn.cursor()

    # --- API Setup ---
    # Starting URL to list Pokémon. Adjust limit as needed.
    base_api_url = "https://pokeapi.co/api/v2/pokemon?limit=50"
    next_url = base_api_url

    while next_url:
        print(f"Fetching list from: {next_url}")
        data = fetch_pokemon_page(next_url)
        next_url = data.get("next")  # URL for the next page (or None)

        # Iterate over the list of Pokémon in this page.
        for basic_pokemon in data.get("results", []):
            detail_url = basic_pokemon["url"]
            print(f"  Fetching details for: {basic_pokemon['name']} from {detail_url}")
            details = fetch_pokemon_details(detail_url)

            # Extract main fields.
            poke_id = details.get("id")
            name = details.get("name")
            height = details.get("height")
            weight = details.get("weight")
            sprite_url = details.get("sprites", {}).get("front_default")

            # --- Insert into the pokemon table ---
            cursor.execute(
                """
                INSERT INTO pokemon (id, name, height, weight, sprite_url)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
                """,
                (poke_id, name, height, weight, sprite_url),
            )

            # --- Insert into the pokemon_stats table ---
            for stat in details.get("stats", []):
                stat_name = stat.get("stat", {}).get("name")
                base_stat = stat.get("base_stat")
                effort = stat.get("effort")
                cursor.execute(
                    """
                    INSERT INTO pokemon_stats (pokemon_id, stat_name, base_stat, effort)
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (pokemon_id, stat_name) DO NOTHING
                    """,
                    (poke_id, stat_name, base_stat, effort),
                )

            # --- Insert into the pokemon_types table ---
            for type_info in details.get("types", []):
                slot = type_info.get("slot")
                type_name = type_info.get("type", {}).get("name")
                cursor.execute(
                    """
                    INSERT INTO pokemon_types (pokemon_id, slot, type_name)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (pokemon_id, slot) DO NOTHING
                    """,
                    (poke_id, slot, type_name),
                )

            # Commit after each Pokémon is processed.
            conn.commit()

            # Optional: sleep a short time to avoid hitting API rate limits.
            time.sleep(0.1)

    # Clean up.
    cursor.close()
    conn.close()
    print("Database population complete.")


if __name__ == "__main__":
    main()
