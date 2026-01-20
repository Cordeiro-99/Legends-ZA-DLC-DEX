import React, { createContext, useState, useEffect } from 'react'
import * as api from '../api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [pokedex, setPokedex] = useState({
    'legends-za': {},
    'national-dex': {},
    'shiny-dex': {}
  })
  const [loading, setLoading] = useState(true)

  // 🔹 Carregar auth ao iniciar
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
      setLoading(false)
    }
  }, [])

  // 🔹 Buscar pokedex do servidor quando houver token
  useEffect(() => {
    if (!token) return

    api.fetchPokedex(token)
      .then(res => {
        if (res?.pokedex) {
          // Garantir que todas as chaves existem
          setPokedex({
            'legends-za': res.pokedex['legends-za'] || {},
            'national-dex': res.pokedex['national-dex'] || {},
            'shiny-dex': res.pokedex['shiny-dex'] || {}
          })
        }
      })
      .catch(() => {
        setPokedex({
          'legends-za': {},
          'national-dex': {},
          'shiny-dex': {}
        })
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
    setPokedex({
      'legends-za': {},
      'national-dex': {},
      'shiny-dex': {}
    })
    localStorage.removeItem('auth')
  }

  // 🔹 Toggle REAL para uma Pokédex específica
  const toggleCaught = async (pokemonId, dexKey = 'legends-za') => {
    // Valida se a dexKey é válida
    const validKeys = ['legends-za', 'national-dex', 'shiny-dex']
    if (!validKeys.includes(dexKey)) {
      console.error('Dex key inválida:', dexKey)
      return
    }

    setPokedex(prev => {
      const currentDex = prev[dexKey] || {}
      const nextDex = {
        ...currentDex,
        [pokemonId]: !currentDex[pokemonId]
      }

      const nextPokedex = {
        ...prev,
        [dexKey]: nextDex
      }

      // Enviar apenas a Pokédex específica para o servidor
      if (token) {
        const updateData = { [dexKey]: nextDex }
        api.updatePokedex(token, updateData).catch(err => {
          console.error('Erro ao atualizar pokedex no servidor:', err)
        })
      }

      return nextPokedex
    })
  }

  // 🔹 Função auxiliar para verificar se um Pokémon está capturado em uma dex específica
  const isPokemonCaught = (pokemonId, dexKey = 'legends-za') => {
    return !!(pokedex[dexKey]?.[pokemonId])
  }

  // 🔹 Função para obter estatísticas de uma dex específica
  const getDexStats = (dexKey = 'legends-za', totalPokemon = 400) => {
    const dex = pokedex[dexKey] || {}
    const captured = Object.keys(dex).filter(id => dex[id]).length
    const percentage = totalPokemon > 0 
      ? Number(((captured / totalPokemon) * 100).toFixed(2))
      : 0
    
    return { captured, total: totalPokemon, percentage }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        pokedex,          
        loading,
        saveAuth,
        logout,
        toggleCaught,     
        isPokemonCaught,  
        getDexStats       
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}