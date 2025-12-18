import { useEffect, useState, useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import Header from './components/Header'
import PokemonCard from './components/PokemonCard'
import Filters from './components/Filters'
import DexSelector from './components/DexSelector'
import pokedexZA from './data/legends_za.json'
import nationalDex from './data/national_dex.json'
import shinyDex from './data/shiny_dex.json'

export default function Home() {
  const { user, logout, toggleCaught: toggleCaughtAPI, token } = useContext(AuthContext)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [showOnlyMissing, setShowOnlyMissing] = useState(false)
  const [currentDex, setCurrentDex] = useState('Legends Z-A')
  const [caught, setCaught] = useState({})
  const [data, setData] = useState(pokedexZA)

  // Função para obter a chave de storage única por usuário
  const getStorageKey = () => {
    if (!user) return null
    // Formato: pokedex-{userId}-{dexName}-caught
    return `pokedex-${user.id}-${currentDex}-caught`
  }

  // Função de logout
  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja terminar sessão?')) {
      logout()
      window.location.href = '/login'
    }
  }

  // Carregar dados quando mudar de dex OU usuário
  useEffect(() => {
    try {
      const storageKey = getStorageKey()
      if (!storageKey) {
        setCaught({})
        return
      }
      
      const saved = localStorage.getItem(storageKey)
      setCaught(saved ? JSON.parse(saved) : {})
      
      // Mudar os dados consoante a dex selecionada
      if (currentDex === 'National Dex') {
        setData(nationalDex)
      } else if (currentDex === 'Shiny Dex') {
        setData(shinyDex)
      } else {
        setData(pokedexZA)
      }
    } catch {
      setCaught({})
    }
  }, [currentDex, user]) // ← user adicionado às dependências!

  // Salvar dados quando caught mudar
  useEffect(() => {
    const storageKey = getStorageKey()
    if (!storageKey) return
    
    localStorage.setItem(storageKey, JSON.stringify(caught))
  }, [caught, currentDex, user]) // ← user adicionado às dependências!

  const toggleCaught = (id) => {
    setCaught(prev => ({ 
      ...prev, 
      [id]: !prev[id] 
    }))
    
    // Se tiver token, atualiza também na API
    if (token) {
      toggleCaughtAPI(id)
    }
  }

  const toggleShowOnlyMissing = () => {
    setShowOnlyMissing(prev => !prev)
  }

  const handleDexChange = (dexName) => {
    setCurrentDex(dexName)
    // Resetar filtros ao mudar de dex
    setQuery('')
    setTypeFilter('All')
    setShowOnlyMissing(false)
  }

  // Filtros aplicados em sequência
  const filtered = data
    .filter(p => (typeFilter === 'All' ? true : p.type.includes(typeFilter)))
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    .filter(p => !showOnlyMissing || !caught[p.id])

  const total = data.length
  const captured = data.filter(pkm => caught[pkm.id]).length
  const missing = total - captured

  return (
    <div className="min-h-screen pokemon-bg-colorful p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabeçalho com logout */}
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
          
          {/* Botão de Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-900/30 border border-red-500/30"
          >
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="transform -rotate-90"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="font-semibold">Sair</span>
          </button>
        </div>

        {/* Header original mantido */}
        <Header total={total} captured={captured} />

        {/* Seletor de Dex */}
        <div className="mt-6">
          <DexSelector 
            currentDex={currentDex}
            onDexChange={handleDexChange}
          />
        </div>

        {/* Informações da Dex - TEMA ESCURO */}
        <div className="mt-6 bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-700/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`text-white px-3 py-1 rounded-full text-sm font-bold ${
                currentDex === 'Legends Z-A' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500' 
                  : currentDex === 'National Dex'
                  ? 'bg-gradient-to-r from-blue-600 to-green-500'
                  : 'bg-gradient-to-r from-yellow-600 to-orange-500'
              }`}>
                {currentDex}
              </div>
              <div className="text-lg font-bold text-white">Pokédex</div>
            </div>
            
            {/* Progresso em barra */}
            <div className="hidden md:block w-48">
              <div className="flex justify-between text-xs text-gray-300 mb-1">
                <span>Progresso</span>
                <span>{Math.round((captured / total) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${(captured / total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-blue-900/30 px-3 py-2 rounded-lg border border-blue-700/30">
              <div className="text-blue-300 font-semibold">Total</div>
              <div className="text-blue-100 font-bold">{total} Pokémon</div>
            </span>
            <span className="bg-green-900/30 px-3 py-2 rounded-lg border border-green-700/30">
              <div className="text-green-300 font-semibold">Capturados</div>
              <div className="text-green-100 font-bold">{captured}</div>
            </span>
            <span className="bg-purple-900/30 px-3 py-2 rounded-lg border border-purple-700/30">
              <div className="text-purple-300 font-semibold">Por Capturar</div>
              <div className="text-purple-100 font-bold">{missing}</div>
            </span>
            <span className="bg-orange-900/30 px-3 py-2 rounded-lg border border-orange-700/30">
              <div className="text-orange-300 font-semibold">Progresso</div>
              <div className="text-orange-100 font-bold">{Math.round((captured / total) * 100)}%</div>
            </span>
            {/* Mostrar estado do filtro ativo */}
            {showOnlyMissing && (
              <span className="bg-red-900/30 px-3 py-2 rounded-lg border border-red-700/30">
                <div className="text-red-300 font-semibold">Filtro Ativo</div>
                <div className="text-red-100 font-bold">Apenas Faltam</div>
              </span>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Filters
            query={query}
            onQuery={setQuery}
            typeFilter={typeFilter}
            onType={setTypeFilter}
            showOnlyMissing={showOnlyMissing}
            onShowOnlyMissing={toggleShowOnlyMissing}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-gray-900/80 rounded-xl shadow-lg border border-gray-700/50 mt-6">
            <div className="text-gray-400 text-6xl mb-4">
              {showOnlyMissing && captured === total ? '🎉' : '🔍'}
            </div>
            <div className="text-gray-200 font-bold text-lg">
              {showOnlyMissing && captured === total 
                ? 'Parabéns! Capturaste todos!' 
                : 'Nenhum Pokémon encontrado'
              }
            </div>
            <div className="text-gray-400 text-sm mt-2">
              {showOnlyMissing && captured === total 
                ? 'Completaste a Pokédex!' 
                : 'Tenta alterar os filtros ou a pesquisa'
              }
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
            {filtered.map(pkm => (
              <PokemonCard
                key={pkm.id}
                pkm={pkm}
                caught={!!caught[pkm.id]}
                onToggle={() => toggleCaught(pkm.id)}
              />
            ))}
          </div>
        )}

        {/* Contador de resultados */}
        <div className="mt-4 text-center text-gray-400 text-sm">
          {showOnlyMissing && (
            <span className="bg-red-900/30 px-3 py-1 rounded-lg">
              A mostrar {filtered.length} Pokémon por capturar
            </span>
          )}
        </div>

        {/* Footer com informação do usuário */}
        <div className="mt-8 pt-4 border-t border-gray-700/50 text-center text-gray-500 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              Sessão ativa como: <span className="text-yellow-400 font-semibold">{user?.username}</span>
              <span className="text-gray-600 mx-2">•</span>
              <span className="text-blue-400">Pokédex: {currentDex}</span>
            </div>
            <div className="mt-2 md:mt-0 flex items-center gap-3">
              <div className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded">
                Progresso salvo para {user?.username}
              </div>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Terminar sessão
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}