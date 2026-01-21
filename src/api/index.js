const API_URL =
  (import.meta.env.VITE_API_URL || 'http://localhost:4000')
    .replace(/\/$/, ''); 

// Base única da API
const API_BASE = `${API_URL}/api`;

console.log('🔧 [DEBUG] API_URL:', API_URL);
console.log('🔧 [DEBUG] API_BASE:', API_BASE);

/* =========================
   AUTH
========================= */

export async function register(username, password) {
  console.log('📡 [REGISTER] Chamando:', { username });
  console.log('📡 [REGISTER] URL completa:', `${API_BASE}/auth/register`);

  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Register failed (${res.status}): ${text}`);
  }

  return res.json();
}

export async function login(username, password) {
  console.log('📡 [LOGIN] URL completa:', `${API_BASE}/auth/login`);

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      error: data.message || 'Login failed',
      status: res.status
    };
  }

  return data; // { token, user }
}

/* =========================
   POKEDEX
========================= */

export async function fetchPokedex(token) {
  console.log('📡 [POKEDEX] URL:', `${API_BASE}/pokedex`);

  const res = await fetch(`${API_BASE}/pokedex`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pokedex error (${res.status}): ${text}`);
  }

  return res.json();
}

export async function updatePokedex(token, pokedexUpdates) {
  console.log('📡 [UPDATE POKEDEX] URL:', `${API_BASE}/pokedex/update`);

  const res = await fetch(`${API_BASE}/pokedex/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ pokedex: pokedexUpdates })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Update error (${res.status}): ${text}`);
  }

  return res.json();
}

/* =========================
   USER / PROFILE
========================= */

export async function fetchUserProfile(token, dex = 'legends-za') {
  console.log('📡 [PROFILE] URL:', `${API_BASE}/user/profile?dex=${dex}`);

  const res = await fetch(`${API_BASE}/user/profile?dex=${dex}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) return null;
  return res.json();
}

export async function fetchAllUserProfiles(token) {
  const res = await fetch(`${API_BASE}/user/profile/all`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) return null;
  return res.json();
}

export async function fetchDexList(token) {
  const res = await fetch(`${API_BASE}/user/profile/dex-list`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) return null;
  return res.json();
}

export { API_BASE, API_URL };
