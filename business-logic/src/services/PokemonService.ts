import PokemonRepository, { Pokemon } from '../repositories/PokemonRepository';

class PokemonService {
    // Fetch all Pokémon (basic details only)
    async getAllPokemon(): Promise<Omit<Pokemon, 'stats' | 'types'>[]> {
        return await PokemonRepository.getAll();
    }

    // Fetch a single Pokémon by ID, including stats and types
    async getPokemonById(id: number): Promise<Pokemon | null> {
        if (!id || id <= 0) {
            throw new Error('Invalid Pokémon ID');
        }

        const pokemon = await PokemonRepository.getById(id);
        if (!pokemon) {
            throw new Error(`Pokémon with ID ${id} not found`);
        }

        return pokemon;
    }
}

export default new PokemonService();
