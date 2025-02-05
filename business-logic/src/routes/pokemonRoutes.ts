import { Router } from 'express';
import PokemonController from '../controllers/PokemonController';

const router = Router();

// Route to get all Pokémon
router.get('/items', PokemonController.getAll);

// Route to get a single Pokémon by ID
router.get('/item/:id', PokemonController.getById);

export default router;
