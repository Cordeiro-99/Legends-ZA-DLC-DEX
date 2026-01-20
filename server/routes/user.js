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

// GET /api/user/profile - Retorna estatísticas GERAIS ou específicas
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Opcional: permitir filtro por dex via query param
    const { dex = 'legends-za' } = req.query;
    const validDexKeys = ['legends-za', 'national-dex', 'shiny-dex'];
    
    if (!validDexKeys.includes(dex)) {
      return res.status(400).json({ error: 'Invalid dex specified' });
    }

    // Acessa a Pokédex específica
    const pokedex = user.pokedex?.[dex] || {};
    const captured = Object.keys(pokedex).filter(id => pokedex[id]).length;

    // Totais diferentes para cada Pokédex
    const dexTotals = {
      'legends-za': 400,      
      'national-dex': 1010,   
      'shiny-dex': 1010       
    };

    const total = dexTotals[dex] || 400;
    const percentage = total > 0
      ? Number(((captured / total) * 100).toFixed(2))
      : 0;

    res.json({
      username: user.username,
      dex: dex,               // Qual dex estamos retornando
      captured,
      total,
      percentage
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/user/profile/all - Retorna estatísticas de TODAS as dex
router.get('/profile/all', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });

    const dexTotals = {
      'legends-za': 400,
      'national-dex': 1010,
      'shiny-dex': 400
    };

    const stats = {};
    let totalOverall = 0;
    let capturedOverall = 0;

    // Calcula estatísticas para cada dex
    for (const dexKey of ['legends-za', 'national-dex', 'shiny-dex']) {
      const pokedex = user.pokedex?.[dexKey] || {};
      const captured = Object.keys(pokedex).filter(id => pokedex[id]).length;
      const total = dexTotals[dexKey] || 0;
      const percentage = total > 0 ? Number(((captured / total) * 100).toFixed(2)) : 0;

      stats[dexKey] = {
        captured,
        total,
        percentage
      };

      totalOverall += total;
      capturedOverall += captured;
    }

    const overallPercentage = totalOverall > 0 
      ? Number(((capturedOverall / totalOverall) * 100).toFixed(2))
      : 0;

    res.json({
      username: user.username,
      stats,
      overall: {
        captured: capturedOverall,
        total: totalOverall,
        percentage: overallPercentage
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/user/profile/dex-list - Lista todas as dex disponíveis
router.get('/profile/dex-list', authMiddleware, async (req, res) => {
  try {
    const dexList = [
      {
        id: 'legends-za',
        name: 'Legends Z-A',
        description: 'Pokémon Legends: Z-A Pokédex',
        total: 400,
        color: 'purple'
      },
      {
        id: 'national-dex',
        name: 'National Dex',
        description: 'Pokémon National Pokédex (all generations)',
        total: 1010,
        color: 'blue'
      },
      {
        id: 'shiny-dex',
        name: 'Shiny Dex',
        description: 'Shiny variant collection',
        total: 400,
        color: 'yellow'
      }
    ];

    res.json({ dexList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;