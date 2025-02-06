// ./src/tests/api.test.ts
import request from 'supertest';
import app from '../app';
import PokemonService from '../services/PokemonService';

jest.mock('../services/PokemonService');

describe('GET /api/items', () => {
  it('should return paginated Pokémon when query parameters are provided', async () => {
    const fakePokemons = [
      { id: 1, name: 'Bulbasaur', height: 7, weight: 69, sprite_url: 'url1' },
      { id: 2, name: 'Ivysaur', height: 10, weight: 130, sprite_url: 'url2' },
    ];
    (PokemonService.getAllPokemon as jest.Mock).mockResolvedValue(fakePokemons);

    const response = await request(app).get('/api/items?limit=2&offset=0');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakePokemons);
    expect(PokemonService.getAllPokemon).toHaveBeenCalledWith(2, 0);
  });

  it('should return all Pokémon when no pagination is provided', async () => {
    const fakePokemons = [
      { id: 1, name: 'Bulbasaur', height: 7, weight: 69, sprite_url: 'url1' },
      { id: 2, name: 'Ivysaur', height: 10, weight: 130, sprite_url: 'url2' },
      { id: 3, name: 'Venusaur', height: 20, weight: 100, sprite_url: 'url3' },
    ];
    (PokemonService.getAllPokemon as jest.Mock).mockResolvedValue(fakePokemons);

    const response = await request(app).get('/api/items');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakePokemons);
    expect(PokemonService.getAllPokemon).toHaveBeenCalledWith(undefined, undefined);
  });
});
