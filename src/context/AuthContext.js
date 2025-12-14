import React, { createContext, useState, useEffect } from 'react';
import * as api from '../api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(()=> {
    try {
      const data = localStorage.getItem('auth');
      return data ? JSON.parse(data).user : null;
    } catch { return null; }
  });
  const [token, setToken] = useState(()=> {
    try { const data = localStorage.getItem('auth'); return data? JSON.parse(data).token : null; } catch { return null; }
  });
  const [pokedex, setPokedex] = useState(()=> {
    try { const data = localStorage.getItem('pokedex'); return data? JSON.parse(data) : {}; } catch { return {}; }
  });

  useEffect(()=> {
    if(token) {
      // fetch server pokedex and merge
      api.fetchPokedex(token).then(res => {
        if(res.pokedex) {
          setPokedex(prev => {
            const merged = { ...prev, ...res.pokedex };
            localStorage.setItem('pokedex', JSON.stringify(merged));
            return merged;
          });
        }
      });
    }
  }, [token]);

  const saveAuth = (userObj, tokenStr) => {
    setUser(userObj);
    setToken(tokenStr);
    localStorage.setItem('auth', JSON.stringify({ user: userObj, token: tokenStr }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth');
  };

  const toggleCaught = async (pokemonId) => {
    setPokedex(prev => {
      const next = {...prev, [pokemonId]: !prev[pokemonId]};
      localStorage.setItem('pokedex', JSON.stringify(next));
      // push update to server if logged in
      if(token) {
        api.updatePokedex(token, { [pokemonId]: next[pokemonId] }).catch(err=> console.error(err));
      }
      return next;
    });
  };

  return <AuthContext.Provider value={{ user, token, pokedex, saveAuth, logout, toggleCaught }}>
    {children}
  </AuthContext.Provider>
}
