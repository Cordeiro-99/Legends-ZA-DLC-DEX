// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwt';

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if(!username || !password) return res.status(400).json({ error: 'Missing fields' });
    const existing = await User.findOne({ username });
    if(existing) return res.status(400).json({ error: 'Username exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password_hash: hash, pokedex: {} });
    await user.save();
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if(!username || !password) return res.status(400).json({ error: 'Missing fields' });
    const user = await User.findOne({ username });
    if(!user) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password_hash);
    if(!match) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
