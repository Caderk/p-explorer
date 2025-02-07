import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PokemonList from './features/pokemon/PokemonList';
import PokemonDetail from './features/pokemon/PokemonDetail';
import { Container } from '@mui/material';

const App: React.FC = () => {
  return (
    <Router>
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Navigate to="/items" />} />
          <Route path="/items" element={<PokemonList />} />
          <Route path="/item/:id" element={<PokemonDetail />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
