import { Request, Response } from 'express';
import PokemonService from '../services/PokemonService';

class PokemonController {
    // Handler for fetching all Pokémon
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const pokemons = await PokemonService.getAllPokemon();
            res.status(200).json(pokemons);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch Pokémon list' });
        }
    }

    // Handler for fetching a single Pokémon by ID
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid Pokémon ID' });
                return;
            }

            const pokemon = await PokemonService.getPokemonById(id);
            res.status(200).json(pokemon);
        } catch (error) {
            res.status(404).json({ error: error instanceof Error ? error.message : 'Pokémon not found' });
        }
    }
}

export default new PokemonController();
