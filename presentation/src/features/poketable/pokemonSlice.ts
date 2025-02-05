import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Pokemon {
  id: number;
  pokemon_id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  sprite_url: string;
}

interface PokemonState {
  data: Pokemon[];
  loading: boolean;
  error: string | null;
}

const initialState: PokemonState = {
  data: [],
  loading: false,
  error: null,
};

// Async thunk to fetch Pokémon data
export const fetchPokemon = createAsyncThunk("pokemon/fetchPokemon", async () => {
  // Simulating an API request (Replace this with actual API call)
  const response = await new Promise<{ data: Pokemon[] }>((resolve) =>
    setTimeout(() =>
      resolve({
        data: [
          { id: 1, pokemon_id: 1, name: "bulbasaur", base_experience: 64, height: 7, weight: 69, sprite_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
          { id: 2, pokemon_id: 4, name: "charmander", base_experience: 62, height: 6, weight: 85, sprite_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" },
          { id: 3, pokemon_id: 7, name: "squirtle", base_experience: 63, height: 5, weight: 90, sprite_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" }
        ]
      }), 1000)
  );
  return response.data;
});

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPokemon.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPokemon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});

export default pokemonSlice.reducer;
