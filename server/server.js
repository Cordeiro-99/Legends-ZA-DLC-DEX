require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.listen(4000, () => {
  console.log('Server running on port 4000');
});

const authRoutes = require('./routes/auth');
const pokedexRoutes = require('./routes/pokedex');
app.use('/api/auth', authRoutes);
app.use('/api/pokedex', pokedexRoutes);
