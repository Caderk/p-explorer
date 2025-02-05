import pool from '../config/database';

export interface Pokemon {
    id: number;
    pokemon_id: number;
    name: string;
    base_experience: number;
    height: number;
    weight: number;
    sprite_url: string;
    stats: { stat_name: string; base_stat: number; effort: number }[];
    types: string[];
}

class PokemonRepository {
    // Fetch all Pokémon (basic details only)
    async getAll(): Promise<Omit<Pokemon, 'stats' | 'types'>[]> {
        const query = `SELECT id, pokemon_id, name, base_experience, height, weight, sprite_url FROM pokemon;`;
        const { rows } = await pool.query(query);
        return rows;
    }

    // Fetch a single Pokémon by ID, including stats and types
    async getById(id: number): Promise<Pokemon | null> {
        const query = `
            SELECT 
                p.id, p.pokemon_id, p.name, p.base_experience, p.height, p.weight, p.sprite_url,
                json_agg(DISTINCT jsonb_build_object('stat_name', s.stat_name, 'base_stat', s.base_stat, 'effort', s.effort)) AS stats,
                json_agg(DISTINCT t.type_name) AS types
            FROM pokemon p
            LEFT JOIN stats s ON p.pokemon_id = s.pokemon_id
            LEFT JOIN types t ON p.pokemon_id = t.pokemon_id
            WHERE p.pokemon_id = $1
            GROUP BY p.id, p.pokemon_id, p.name, p.base_experience, p.height, p.weight, p.sprite_url;
        `;

        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) return null;
        return rows[0];
    }
}

export default new PokemonRepository();
