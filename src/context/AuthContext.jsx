import React, { createContext, useState, useEffect } from 'react'
import * as api from '../api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [pokedex, setPokedex] = useState({})
  const [loading, setLoading] = useState(true) // 🔹 FUNDAMENTAL

  // 🔹 Carregar auth ao iniciar (ANTES de decidir rotas)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('auth')

      if (stored) {
        const parsed = JSON.parse(stored)
        setUser(parsed.user)
        setToken(parsed.token)
      }
    } catch (err) {
      console.error('Erro a restaurar auth:', err)
    } finally {
      setLoading(false) // 👈 só aqui termina o loading
    }
  }, [])

  // 🔹 Buscar pokedex do servidor quando houver token
  useEffect(() => {
    if (!token) return

    api.fetchPokedex(token)
      .then(res => {
        if (res?.pokedex) {
          setPokedex(res.pokedex)
        }
      })
      .catch(() => {
        setPokedex({})
      })
  }, [token])

  const saveAuth = (userObj, tokenStr) => {
    setUser(userObj)
    setToken(tokenStr)

    localStorage.setItem(
      'auth',
      JSON.stringify({ user: userObj, token: tokenStr })
    )
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setPokedex({})
    localStorage.removeItem('auth')
  }

  // 🔹 Toggle REAL (frontend + backend)
  const toggleCaught = async (pokemonId) => {
    setPokedex(prev => {
      const next = {
        ...prev,
        [pokemonId]: !prev[pokemonId]
      }

      if (token) {
        api.updatePokedex(token, {
          [pokemonId]: next[pokemonId]
        }).catch(() => {})
      }

      return next
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        pokedex,
        loading,        // 👈 EXPORTAR loading
        saveAuth,
        logout,
        toggleCaught
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
