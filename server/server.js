require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const pokedexRoutes = require('./routes/pokedex');
const userRoutes = require('./routes/user');

app.use('/api/auth', authRoutes);
app.use('/api/pokedex', pokedexRoutes);
app.use('/api/user', userRoutes);

app.listen(4000, () => {
  console.log('Server running on port 4000');
});
