import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import type { RootState, AppDispatch } from '../../app/store';
import { fetchPokemonDetail } from './pokemonSlice';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Paper,
  Box,
  Button,
  Grid
} from '@mui/material';

const MAX_POKEMON = 151; // Maximum Pokemon ID (default)

const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

const PokemonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const pokemonId = Number(id);
  const dispatch = useAppDispatch<AppDispatch>();
  const navigate = useNavigate();
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

  // Navigation handlers
  const goToPrevious = () => {
    if (pokemonId > 1) {
      navigate(`/item/${pokemonId - 1}`);
    }
  };

  const goToNext = () => {
    if (pokemonId < MAX_POKEMON) {
      navigate(`/item/${pokemonId + 1}`);
    }
  };

  // Always go back to the list (optionally, you could preserve query parameters)
  const goBackToList = () => {
    navigate("/items");
  };

  return (
    <Paper sx={{ maxWidth: 800, margin: 'auto', mt: 4, p: 2 }}>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Button variant="contained" onClick={goBackToList}>
          Back to List
        </Button>
        <Box>
          <Button variant="outlined" onClick={goToPrevious} disabled={pokemonId <= 1} sx={{ mr: 1 }}>
            Previous
          </Button>
          <Button variant="outlined" onClick={goToNext} disabled={pokemonId >= MAX_POKEMON}>
            Next
          </Button>
        </Box>
      </Box>
      <Card sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Left column: Image */}
          <Grid item xs={12} sm={4}>
            <CardMedia
              component="img"
              image={pokemon.sprite_url}
              alt={pokemon.name}
              sx={{
                width: '100%',
                maxWidth: 120,
                height: 120,
                imageRendering: 'pixelated',
                objectFit: 'contain',
                border: '1px solid #ccc'
              }}
            />
          </Grid>
          {/* Right column: Data */}
          <Grid item xs={12} sm={8}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {capitalize(pokemon.name)}
              </Typography>
              <Typography variant="body1">
                <strong>Height:</strong> {pokemon.height}
              </Typography>
              <Typography variant="body1">
                <strong>Weight:</strong> {pokemon.weight}
              </Typography>
              <Box mt={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Stats:
                </Typography>
                {pokemon.stats.map((stat, index) => (
                  <Typography key={index} variant="body2">
                    {capitalize(stat.stat_name)}: {stat.base_stat} (effort: {stat.effort})
                  </Typography>
                ))}
              </Box>
              <Box mt={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Types:
                </Typography>
                <Typography variant="body2">
                  {pokemon.types.map(t => capitalize(t)).join(', ')}
                </Typography>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Paper>
  );
};

export default PokemonDetail;
