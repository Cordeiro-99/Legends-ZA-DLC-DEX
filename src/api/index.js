const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

export async function register(username, password) {
  const res = await fetch(API_BASE + '/auth/register', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function login(username, password) {
  const res = await fetch(API_BASE + '/auth/login', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function fetchPokedex(token) {
  const res = await fetch(API_BASE + '/pokedex', {
    headers: { Authorization: 'Bearer ' + token }
  });
  return res.json();
}

export async function updatePokedex(token, pokedex) {
  const res = await fetch(API_BASE + '/pokedex/update', {
    method: 'PUT',
    headers: { 'Content-Type':'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({ pokedex })
  });
  return res.json();
}
