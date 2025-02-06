// ./src/tests/PokemonService.test.ts
import PokemonService from '../services/PokemonService';
import PokemonRepository from '../repositories/PokemonRepository';

jest.mock('../repositories/PokemonRepository');

describe('PokemonService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return paginated list of Pokémon when limit and offset are provided', async () => {
    const fakePokemons = [
      { id: 1, name: 'Bulbasaur', height: 7, weight: 69, sprite_url: 'url1' },
      { id: 2, name: 'Ivysaur', height: 10, weight: 130, sprite_url: 'url2' },
    ];
    (PokemonRepository.getAll as jest.Mock).mockResolvedValue(fakePokemons);
    
    const result = await PokemonService.getAllPokemon(2, 0);
    
    expect(PokemonRepository.getAll).toHaveBeenCalledWith(2, 0);
    expect(result).toEqual(fakePokemons);
  });

  it('should return all Pokémon when no pagination parameters are provided', async () => {
    const fakePokemons = [
      { id: 1, name: 'Bulbasaur', height: 7, weight: 69, sprite_url: 'url1' },
      { id: 2, name: 'Ivysaur', height: 10, weight: 130, sprite_url: 'url2' },
      { id: 3, name: 'Venusaur', height: 20, weight: 100, sprite_url: 'url3' },
    ];
    (PokemonRepository.getAll as jest.Mock).mockResolvedValue(fakePokemons);
    
    const result = await PokemonService.getAllPokemon();
    
    expect(PokemonRepository.getAll).toHaveBeenCalledWith(undefined, undefined);
    expect(result).toEqual(fakePokemons);
  });
});
