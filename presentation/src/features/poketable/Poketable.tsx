import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchPokemon } from "./pokemonSlice";
import type { RootState, AppDispatch } from "../../app/store";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Poketable() {
    const dispatch = useAppDispatch<AppDispatch>();
    const { data, loading, error } = useAppSelector((state: RootState) => state.pokemon);

    useEffect(() => {
        dispatch(fetchPokemon());
    }, [dispatch]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <p>Error loading Pokémon: {error}</p>;
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="pokémon table">
                <TableHead>
                    <TableRow>
                        <TableCell>Sprite</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Base Experience</TableCell>
                        <TableCell align="right">Height</TableCell>
                        <TableCell align="right">Weight</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((pokemon) => (
                        <TableRow key={pokemon.id}>
                            <TableCell>
                                <img src={pokemon.sprite_url} alt={pokemon.name} width="50" />
                            </TableCell>
                            <TableCell>{pokemon.name}</TableCell>
                            <TableCell align="right">{pokemon.base_experience}</TableCell>
                            <TableCell align="right">{pokemon.height}</TableCell>
                            <TableCell align="right">{pokemon.weight}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
