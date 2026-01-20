require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

connectDB();

const app = express();

// Configuração de CORS para aceitar o domínio do Vercel
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://legends-za-dlc-dex.vercel.app',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const authRoutes = require('./routes/auth');
const pokedexRoutes = require('./routes/pokedex');
const userRoutes = require('./routes/user');

app.use('/api/auth', authRoutes);
app.use('/api/pokedex', pokedexRoutes);
app.use('/api/user', userRoutes);

// Usar a porta do ambiente (Render define automaticamente) ou 4000 localmente
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
