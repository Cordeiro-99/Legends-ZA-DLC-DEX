const allTypes = [
  { value: 'All', label: '📋 Todos os Tipos' },
  { value: 'Normal', label: '😐 Normal' },
  { value: 'Fire', label: '🔥 Fire' },
  { value: 'Water', label: '💧 Water' },
  { value: 'Electric', label: '⚡ Electric' },
  { value: 'Grass', label: '🌿 Grass' },
  { value: 'Ice', label: '❄️ Ice' },
  { value: 'Fighting', label: '🥊 Fighting' },
  { value: 'Poison', label: '☠️ Poison' },
  { value: 'Ground', label: '🏜️ Ground' },
  { value: 'Flying', label: '🕊️ Flying' },
  { value: 'Psychic', label: '🔮 Psychic' },
  { value: 'Bug', label: '🐛 Bug' },
  { value: 'Rock', label: '🪨 Rock' },  // ✅ Corrigido
  { value: 'Ghost', label: '👻 Ghost' },
  { value: 'Dark', label: '🌑 Dark' },
  { value: 'Dragon', label: '🐉 Dragon' },
  { value: 'Steel', label: '⚙️ Steel' },
  { value: 'Fairy', label: '🧚 Fairy' }
]

export default function Filters({ query, onQuery, typeFilter, onType, showOnlyMissing, onShowOnlyMissing }) {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-center bg-gray-900/80 p-4 rounded-xl shadow-lg border border-gray-700/50">
      {/* Pesquisa */}
      <div className="relative w-full md:w-1/2">
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          className="w-full p-3 rounded-xl bg-gray-800 border-2 border-gray-700 focus:border-red-500 focus:outline-none transition-colors text-white placeholder-gray-400"
          placeholder="🔍 Pesquisar Pokémon..."
        />
      </div>

      {/* Filtro de Tipo */}
      <select 
        value={typeFilter} 
        onChange={(e) => onType(e.target.value)} 
        className="p-3 rounded-xl bg-gray-800 border-2 border-gray-700 focus:border-red-500 focus:outline-none transition-colors text-white w-full md:w-auto"
      >
        {allTypes.map(type => (
          <option key={type.value} value={type.value} className="bg-gray-800">
            {type.label}
          </option>
        ))}
      </select>

      {/* Botão "Mostrar apenas não capturados" */}
      <button
        onClick={onShowOnlyMissing}
        className={`
          w-full md:w-auto p-3 rounded-xl font-semibold transition-all duration-300 border-2
          flex items-center justify-center gap-2
          ${showOnlyMissing
            ? 'bg-red-600 border-red-500 hover:bg-red-700 text-white shadow-lg'
            : 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200'
          }
        `}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span>{showOnlyMissing ? 'Mostrar Todos' : 'Apenas Faltam'}</span>
      </button>
    </div>
  )
}