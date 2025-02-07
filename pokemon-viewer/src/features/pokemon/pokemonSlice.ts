import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PokemonSummary, PokemonDetail } from './pokemonRepository';
import { fetchPokemons, fetchPokemonById } from './pokemonRepository';

interface PokemonState {
    list: PokemonSummary[];
    listStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    listError: string | null;
    detail: { [id: number]: PokemonDetail | undefined };
    detailStatus: { [id: number]: 'idle' | 'loading' | 'succeeded' | 'failed' };
    detailError: { [id: number]: string | null };
}

const initialState: PokemonState = {
    list: [],
    listStatus: 'idle',
    listError: null,
    detail: {},
    detailStatus: {},
    detailError: {}
};

export const fetchPokemonList = createAsyncThunk(
    'pokemon/fetchList',
    async ({ limit, offset }: { limit: number; offset: number }) => {
        return await fetchPokemons(limit, offset);
    }
);

export const fetchPokemonDetail = createAsyncThunk(
    'pokemon/fetchDetail',
    async (id: number) => {
        return await fetchPokemonById(id);
    }
);

const pokemonSlice = createSlice({
    name: 'pokemon',
    initialState,
    reducers: {},
    extraReducers: builder => {
        // List
        builder.addCase(fetchPokemonList.pending, state => {
            state.listStatus = 'loading';
        });
        builder.addCase(fetchPokemonList.fulfilled, (state, action) => {
            state.listStatus = 'succeeded';
            state.list = action.payload;
        });
        builder.addCase(fetchPokemonList.rejected, (state, action) => {
            state.listStatus = 'failed';
            state.listError = action.error.message || 'Failed to fetch';
        });
        // Detail
        builder.addCase(fetchPokemonDetail.pending, (state, action) => {
            state.detailStatus[action.meta.arg] = 'loading';
        });
        builder.addCase(fetchPokemonDetail.fulfilled, (state, action) => {
            state.detailStatus[action.payload.id] = 'succeeded';
            state.detail[action.payload.id] = action.payload;
        });
        builder.addCase(fetchPokemonDetail.rejected, (state, action) => {
            state.detailStatus[action.meta.arg] = 'failed';
            state.detailError[action.meta.arg] = action.error.message || 'Failed to fetch detail';
        });
    }
});

export default pokemonSlice.reducer;
