// server/server.js
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./db'); // mongoose connection
const authRoutes = require('./routes/auth');
const pokedexRoutes = require('./routes/pokedex');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pokedex', pokedexRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, ()=> console.log('Server running on port', PORT));
