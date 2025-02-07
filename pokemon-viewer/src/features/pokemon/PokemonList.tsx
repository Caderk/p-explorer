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
    Typography
} from '@mui/material';

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
        <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Pokémon List
            </Typography>
            {listStatus === 'loading' ? (
                <CircularProgress />
            ) : listStatus === 'failed' ? (
                <Typography color="error">{listError}</Typography>
            ) : (
                <>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Height</TableCell>
                                    <TableCell>Weight</TableCell>
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
                                        <TableCell>{pokemon.name}</TableCell>
                                        <TableCell>{pokemon.height}</TableCell>
                                        <TableCell>{pokemon.weight}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={1000}  // Ideally, fetch and store the total count from the API.
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
