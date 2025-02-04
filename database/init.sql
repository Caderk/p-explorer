-- Create the pokemon table
CREATE TABLE IF NOT EXISTS pokemon (
    id SERIAL PRIMARY KEY,
    pokemon_id INT UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    base_experience INT,
    height INT,
    weight INT,
    sprite_url TEXT
);

-- Create the stats table
CREATE TABLE IF NOT EXISTS stats (
    id SERIAL PRIMARY KEY,
    pokemon_id INT NOT NULL REFERENCES pokemon(pokemon_id) ON DELETE CASCADE,
    stat_name VARCHAR(50) NOT NULL,
    base_stat INT NOT NULL,
    effort INT NOT NULL
);

-- Create the types table
CREATE TABLE IF NOT EXISTS types (
    id SERIAL PRIMARY KEY,
    pokemon_id INT NOT NULL REFERENCES pokemon(pokemon_id) ON DELETE CASCADE,
    type_name VARCHAR(50) NOT NULL
);
