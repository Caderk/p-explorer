import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import type { RootState, AppDispatch } from '../../app/store';
import { fetchPokemonList } from './pokemonSlice';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    CircularProgress,
    Typography,
    Box
} from '@mui/material';

const MAX_POKEMON = 151; // Total count for pagination

// Helper function to capitalize the first letter.
const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

const PokemonList: React.FC = () => {
    const dispatch = useAppDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { list, listStatus, listError } = useAppSelector((state: RootState) => state.pokemon);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        // Fetch list using current page and rowsPerPage
        dispatch(fetchPokemonList({ limit: rowsPerPage, offset: page * rowsPerPage }));
    }, [dispatch, page, rowsPerPage]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Paper sx={{ width: '100%', p: 2, mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Pokémon List
            </Typography>
            {listStatus === 'loading' ? (
                <CircularProgress />
            ) : listStatus === 'failed' ? (
                <Typography color="error">{listError}</Typography>
            ) : (
                <>
                    {/* Wrap the table in a container with fixed height and overflow auto */}
                    <TableContainer sx={{ maxHeight: 400, mt: 2 }}>
                        <Table stickyHeader sx={{ tableLayout: 'fixed' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: 50 }}>ID</TableCell>
                                    <TableCell sx={{ width: '40%' }}>Name</TableCell>
                                    <TableCell sx={{ width: 100 }}>Height</TableCell>
                                    <TableCell sx={{ width: 100 }}>Weight</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {list.map(pokemon => (
                                    <TableRow
                                        key={pokemon.id}
                                        hover
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/item/${pokemon.id}`)}
                                    >
                                        <TableCell>{pokemon.id}</TableCell>
                                        <TableCell>{capitalize(pokemon.name)}</TableCell>
                                        <TableCell>{pokemon.height}</TableCell>
                                        <TableCell>{pokemon.weight}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={MAX_POKEMON}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            )}
        </Paper>
    );
};

export default PokemonList;
