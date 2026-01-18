import { useState, useContext, useEffect } from 'react'
import { AuthContext } from './context/AuthContext'
import Header from './components/Header'
import PokemonCard from './components/PokemonCard'
import Filters from './components/Filters'
import DexSelector from './components/DexSelector'
import pokedexZA from './data/legends_za.json'
import nationalDex from './data/national_dex.json'
import shinyDex from './data/shiny_dex.json'

export default function Home() {
  const { user, logout, toggleCaught, pokedex } = useContext(AuthContext)

  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [showOnlyMissing, setShowOnlyMissing] = useState(false)
  const [currentDex, setCurrentDex] = useState('Legends Z-A')
  const [data, setData] = useState(pokedexZA)

  // Logout
  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja terminar sessão?')) {
      logout()
      window.location.href = '/login'
    }
  }

  // Atualiza os dados da dex
  useEffect(() => {
    if (currentDex === 'National Dex') {
      setData(nationalDex)
    } else if (currentDex === 'Shiny Dex') {
      setData(shinyDex)
    } else {
      setData(pokedexZA)
    }
  }, [currentDex])

  const toggleShowOnlyMissing = () => {
    setShowOnlyMissing(prev => !prev)
  }

  const handleDexChange = (dexName) => {
    setCurrentDex(dexName)
    setQuery('')
    setTypeFilter('All')
    setShowOnlyMissing(false)
  }

  const filtered = data
    .filter(p => (typeFilter === 'All' ? true : p.type.includes(typeFilter)))
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    .filter(p => !showOnlyMissing || !pokedex[p.id])

  const total = data.length
  const captured = data.filter(pkm => pokedex[pkm.id]).length
  const missing = total - captured

  return (
    <div className="min-h-screen pokemon-bg-colorful p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Pokédex Tracker
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="text-gray-300">
                Bem-vindo, <span className="font-bold text-yellow-300">{user?.username}</span>
              </div>
              <div className="text-xs bg-blue-900/50 px-2 py-1 rounded text-blue-300">
                Dex: {currentDex}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Sair
          </button>
        </div>

        <Header total={total} captured={captured} />

        <DexSelector
          currentDex={currentDex}
          onDexChange={handleDexChange}
        />

        <Filters
          query={query}
          onQuery={setQuery}
          typeFilter={typeFilter}
          onType={setTypeFilter}
          showOnlyMissing={showOnlyMissing}
          onShowOnlyMissing={toggleShowOnlyMissing}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
          {filtered.map(pkm => (
            <PokemonCard
              key={pkm.id}
              pkm={pkm}
              caught={!!pokedex[pkm.id]}
              onToggle={() => toggleCaught(pkm.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
