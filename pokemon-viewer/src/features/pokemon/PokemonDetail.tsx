import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import type { RootState, AppDispatch } from '../../app/store';
import { fetchPokemonDetail } from './pokemonSlice';
import { useParams } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    CircularProgress,
    Paper,
    Box
} from '@mui/material';

const PokemonDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const pokemonId = Number(id);
    const dispatch = useAppDispatch<AppDispatch>();
    const pokemon = useAppSelector((state: RootState) => state.pokemon.detail[pokemonId]);
    const detailStatus = useAppSelector((state: RootState) => state.pokemon.detailStatus[pokemonId]);
    const detailError = useAppSelector((state: RootState) => state.pokemon.detailError[pokemonId]);

    useEffect(() => {
        if (!pokemon && detailStatus !== 'loading') {
            dispatch(fetchPokemonDetail(pokemonId));
        }
    }, [dispatch, pokemon, pokemonId, detailStatus]);

    if (detailStatus === 'loading' || !pokemon) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (detailStatus === 'failed') {
        return <Typography color="error">{detailError}</Typography>;
    }

    return (
        <Paper sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
            <Card>
                <CardMedia component="img" height="300" image={pokemon.sprite_url} alt={pokemon.name} />
                <CardContent>
                    <Typography variant="h5">{pokemon.name}</Typography>
                    <Typography variant="body1">Height: {pokemon.height}</Typography>
                    <Typography variant="body1">Weight: {pokemon.weight}</Typography>
                    <Typography variant="subtitle1" mt={2}>
                        Stats:
                    </Typography>
                    {pokemon.stats.map((stat, index) => (
                        <Typography key={index} variant="body2">
                            {stat.stat_name}: {stat.base_stat} (effort: {stat.effort})
                        </Typography>
                    ))}
                    <Typography variant="subtitle1" mt={2}>
                        Types:
                    </Typography>
                    <Typography variant="body2">{pokemon.types.join(', ')}</Typography>
                </CardContent>
            </Card>
        </Paper>
    );
};

export default PokemonDetail;
