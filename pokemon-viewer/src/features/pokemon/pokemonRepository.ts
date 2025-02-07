// ./src/features/pokemon/pokemonRepository.ts

export interface PokemonSummary {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprite_url: string;
}

export interface PokemonDetail extends PokemonSummary {
  stats: { stat_name: string; base_stat: number; effort: number }[];
  types: string[];
}

// Use the environment variable if defined; otherwise, fall back to a relative path.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const fetchPokemons = async (limit: number, offset: number): Promise<PokemonSummary[]> => {
  const response = await fetch(`${API_BASE_URL}/items?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Failed to fetch pokemons');
  }
  return response.json();
};

export const fetchPokemonById = async (id: number): Promise<PokemonDetail> => {
  const response = await fetch(`${API_BASE_URL}/item/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch pokemon detail');
  }
  return response.json();
};
