require('dotenv').config();
const express = require('express');
const connectDB = require('./db');

connectDB();

const app = express();
app.use(express.json());

app.listen(4001, () => {
  console.log('Server running on port 4001');
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
