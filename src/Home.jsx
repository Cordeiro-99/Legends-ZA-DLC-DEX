import { useState, useContext, useEffect } from 'react'
import { AuthContext } from './context/AuthContext'
import Header from './components/Header'
import PokemonCard from './components/PokemonCard'
import Filters from './components/Filters'
import DexSelector from './components/DexSelector'
import pokedexZA from './data/legends_za.json'
import nationalDex from './data/national_dex.json'
import shinyDex from './data/shiny_dex.json'
import { Link, useSearchParams } from 'react-router-dom'

export default function Home() {
  const { user, logout, toggleCaught, pokedex, isPokemonCaught } = useContext(AuthContext)
  
  const [searchParams, setSearchParams] = useSearchParams()
  const dexParam = searchParams.get('dex') || 'legends-za'

  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [showOnlyMissing, setShowOnlyMissing] = useState(false)
  
  // Mapeamento entre chaves e nomes
  const dexConfig = {
    'legends-za': { name: 'Legends Z-A', data: pokedexZA },
    'national-dex': { name: 'National Dex', data: nationalDex },
    'shiny-dex': { name: 'Shiny Dex', data: shinyDex }
  }
  
  // Estado inicial baseado no parâmetro da URL
  const [currentDex, setCurrentDex] = useState(dexConfig[dexParam]?.name || 'Legends Z-A')
  const [currentDexKey, setCurrentDexKey] = useState(dexParam)
  const [data, setData] = useState(dexConfig[dexParam]?.data || pokedexZA)

  // Logout
  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja terminar sessão?')) {
      logout()
      window.location.href = '/login'
    }
  }

  // Efeito principal: sincroniza estado com parâmetro da URL
  useEffect(() => {
    console.log('🔍 URL param changed:', dexParam)
    
    const config = dexConfig[dexParam]
    if (config) {
      setCurrentDex(config.name)
      setCurrentDexKey(dexParam)
      setData(config.data)
      
      // Reset filters quando muda de dex
      setQuery('')
      setTypeFilter('All')
      setShowOnlyMissing(false)
    }
  }, [dexParam])

  // Efeito secundário: atualiza URL quando muda dex via seletor
  useEffect(() => {
    // Mapeamento reverso: nome para chave
    const nameToKey = {
      'Legends Z-A': 'legends-za',
      'National Dex': 'national-dex',
      'Shiny Dex': 'shiny-dex'
    }
    
    const key = nameToKey[currentDex]
    if (key && key !== dexParam) {
      console.log('🔁 Updating URL to:', key)
      setSearchParams({ dex: key })
    }
  }, [currentDex, dexParam, setSearchParams])

  const toggleShowOnlyMissing = () => {
    setShowOnlyMissing(prev => !prev)
  }

  const handleDexChange = (dexName) => {
    console.log('🎯 Dex changed via selector:', dexName)
    setCurrentDex(dexName)
  }

  // Filtra os Pokémon
  const filtered = data
    .filter(p => (typeFilter === 'All' ? true : p.type.includes(typeFilter)))
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    .filter(p => !showOnlyMissing || !isPokemonCaught(p.id, currentDexKey))

  // Calcula estatísticas para a dex atual
  const total = data.length
  const captured = data.filter(pkm => isPokemonCaught(pkm.id, currentDexKey)).length
  const missing = total - captured
  const percentage = total > 0 ? Math.round((captured / total) * 100) : 0

  // Função para lidar com o toggle do Pokémon
  const handleTogglePokemon = (pokemonId) => {
    toggleCaught(pokemonId, currentDexKey)
  }

  console.log('📊 Current state:', {
    dexParam,
    currentDex,
    currentDexKey,
    dataLength: data.length
  })

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
                Bem-vindo,{' '}
                <Link 
                  to="/profile" 
                  className="font-bold text-yellow-300 hover:text-yellow-400 hover:underline cursor-pointer transition-colors"
                >
                  {user.username}
                </Link>
              </div>
              <div className="text-xs bg-blue-900/50 px-2 py-1 rounded text-blue-300">
                Dex: {currentDex}
              </div>
              <div className="text-xs bg-green-900/50 px-2 py-1 rounded text-green-300">
                {captured}/{total} ({percentage}%)
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to="/profile"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Sair
            </button>
          </div>
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

        <div className="mt-4 mb-6">
          <div className="flex items-center justify-between text-sm text-gray-300">
            <div>
              Mostrando <span className="font-bold">{filtered.length}</span> Pokémon
              {showOnlyMissing && <span className="ml-2 text-yellow-300">(Apenas faltam)</span>}
            </div>
            <div className="flex items-center gap-2">
              {typeFilter !== 'All' && (
                <span className="bg-gray-800 px-2 py-1 rounded">
                  Tipo: {typeFilter}
                </span>
              )}
              <span className="text-xs text-gray-500">
                Dex ID: {currentDexKey}
              </span>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-700">
            <div className="text-gray-400 text-xl mb-2">Nenhum Pokémon encontrado</div>
            <div className="text-gray-500">
              {showOnlyMissing && captured === total 
                ? '🎉 Parabéns! Você completou esta Pokédex!' 
                : 'Tente ajustar os filtros de busca'}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map(pkm => (
              <PokemonCard
                key={`${currentDexKey}-${pkm.id}`}
                pkm={pkm}
                caught={isPokemonCaught(pkm.id, currentDexKey)}
                onToggle={() => handleTogglePokemon(pkm.id)}
                dexType={currentDexKey}
              />
            ))}
          </div>
        )}

        {/* Estatísticas no rodapé */}
        <div className="mt-8 pt-6 border-t border-gray-700/50">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{captured}</div>
              <div>Capturados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{missing}</div>
              <div>Faltam</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{total}</div>
              <div>Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{percentage}%</div>
              <div>Completo</div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <Link
              to="/profile"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-bold hover:opacity-90 transition-all"
            >
              Ver todas as Pokédex no Perfil
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}