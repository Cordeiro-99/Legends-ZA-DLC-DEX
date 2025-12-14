// server/routes/pokedex.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwt';

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch(err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// GET full pokedex object for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if(!user) return res.status(404).json({ error: 'User not found' });
    res.json({ pokedex: user.pokedex || {} });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update (merge) pokedex: server merges shallowly with existing
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const updates = req.body.pokedex;
    if(updates === undefined) return res.status(400).json({ error: 'No updates' });
    const user = await User.findById(req.userId);
    if(!user) return res.status(404).json({ error: 'User not found' });

    // If client sends an object with keys to merge (e.g. {"25": {...}}), merge
    if(typeof updates === 'object' && !Array.isArray(updates)) {
      user.pokedex = { ...(user.pokedex || {}), ...updates };
    } else {
      // Otherwise replace
      user.pokedex = updates;
    }
    await user.save();
    res.json({ success: true, pokedex: user.pokedex });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
