-- Drop tables if they already exist. Note: drop the dependent tables first.
DROP TABLE IF EXISTS pokemon_types;
DROP TABLE IF EXISTS pokemon_stats;
DROP TABLE IF EXISTS pokemon;

-- Main table for Pokémon data.
CREATE TABLE pokemon (
    id INTEGER PRIMARY KEY,         -- Use the API id (e.g. 1 for Bulbasaur)
    name VARCHAR(100) NOT NULL,
    height INTEGER,
    weight INTEGER,
    sprite_url TEXT                 -- This will store the URL from sprites.front_default
);

-- Table for the Pokémon stats.
CREATE TABLE pokemon_stats (
    pokemon_id INTEGER NOT NULL,
    stat_name VARCHAR(50) NOT NULL, -- Flattened from stat.name in the JSON
    base_stat INTEGER NOT NULL,
    effort INTEGER NOT NULL,
    PRIMARY KEY (pokemon_id, stat_name),
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id)
);

-- Table for the Pokémon types.
CREATE TABLE pokemon_types (
    pokemon_id INTEGER NOT NULL,
    slot INTEGER NOT NULL,          -- This indicates the ordering (1, 2, etc.)
    type_name VARCHAR(50) NOT NULL, -- Flattened from type.name in the JSON
    PRIMARY KEY (pokemon_id, slot),
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id)
);
