import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pokemonRoutes from './routes/pokemonRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON request bodies

// Routes
app.use('/api', pokemonRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'API is running' });
});

export default app;
