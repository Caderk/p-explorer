// ./src/repositories/PokemonRepository.ts
import pool from '../config/database';

export interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    sprite_url: string;
    stats: { stat_name: string; base_stat: number; effort: number }[];
    types: string[];
}

class PokemonRepository {
    // Fetch all Pokémon (basic details only), optionally paginated
    async getAll(limit?: number, offset?: number): Promise<Omit<Pokemon, 'stats' | 'types'>[]> {
        let query = `SELECT id, name, height, weight, sprite_url FROM pokemon`;
        const params: any[] = [];

        // Use an explicit check instead of relying on typeof alone.
        if (limit !== undefined && offset !== undefined) {
            query += ` LIMIT $1 OFFSET $2`;
            params.push(limit, offset);
        }

        console.log("Running query:", query, "with params:", params);  // For debugging
        const { rows } = await pool.query(query, params);
        return rows;
    }

    // Fetch a single Pokémon by ID, including stats and types
    async getById(id: number): Promise<Pokemon | null> {
        const query = `
      SELECT 
          p.id, p.name, p.height, p.weight, p.sprite_url,
          json_agg(DISTINCT jsonb_build_object('stat_name', ps.stat_name, 'base_stat', ps.base_stat, 'effort', ps.effort)) AS stats,
          json_agg(DISTINCT pt.type_name) AS types
      FROM pokemon p
      LEFT JOIN pokemon_stats ps ON p.id = ps.pokemon_id
      LEFT JOIN pokemon_types pt ON p.id = pt.pokemon_id
      WHERE p.id = $1
      GROUP BY p.id, p.name, p.height, p.weight, p.sprite_url;
    `;
        const { rows } = await pool.query(query, [id]);
        if (rows.length === 0) return null;
        return rows[0];
    }
}

export default new PokemonRepository();
