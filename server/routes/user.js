const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwt';


async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });

  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// GET /api/user/profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });

    const pokedex = user.pokedex || {};
    const captured = Object.keys(pokedex).length;

    //  Ajusta conforme a tua dex real
    const TOTAL_POKEMON = 400;

    const percentage =
      TOTAL_POKEMON > 0
        ? Number(((captured / TOTAL_POKEMON) * 100).toFixed(2))
        : 0;

    res.json({
      username: user.username,
      captured,
      total: TOTAL_POKEMON,
      percentage
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
