export default function PokemonCard({ pkm, caught, onToggle }) {
  const mainType = pkm.type[0].toLowerCase();

  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-4 transition-all duration-300 pokemon-card
      ${caught 
        ? 'bg-gradient-to-br from-gray-900 to-green-900/30 border-2 border-green-600 shadow-lg' 
        : 'bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 shadow-md'
      }
      hover:shadow-xl hover:scale-105 hover:border-gray-600
    `}>
      
      {/* Efeito de brilho baseado no tipo */}
      <div className={`absolute inset-0 bg-gradient-to-br from-${mainType}-500/10 to-${mainType}-300/5 rounded-2xl`}></div>
      
      {/* Indicador de capturado */}
      {caught && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-green-600 text-white p-1 rounded-full shadow-lg">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}

      {/* Container da imagem com fundo gradiente */}
      <div className="relative mb-4">
        <div className={`
          w-28 h-28 mx-auto rounded-full p-3 shadow-inner
          ${caught 
            ? 'bg-gradient-to-br from-green-900/50 to-emerald-800/50' 
            : 'bg-gradient-to-br from-gray-800 to-gray-700'
          }
        `}>
          <div className="w-full h-full bg-gray-900/80 rounded-full flex items-center justify-center shadow-sm">
            {pkm.sprite ? (
              <img 
                src={pkm.sprite} 
                alt={pkm.name} 
                className="w-20 h-20 object-contain drop-shadow-md transition-transform duration-300 hover:scale-110" 
              />
            ) : (
              <span className="text-gray-500 font-bold text-sm">#{pkm.id.toString().padStart(3, '0')}</span>
            )}
          </div>
        </div>
      </div>

      {/* Número e nome */}
      <div className="text-center mb-3 relative z-10">
        <div className="text-xs font-mono text-gray-400 bg-gray-800/50 rounded-full px-2 py-1 inline-block mb-1">
          #{pkm.id.toString().padStart(3, '0')}
        </div>
        <div className="text-lg font-bold capitalize text-white bg-gray-800/50 rounded-lg py-1 px-2 shadow-sm">
          {pkm.name}
        </div>
      </div>

      {/* Tipos */}
      <div className="flex gap-1.5 justify-center mb-4 relative z-10">
        {pkm.type.map(type => (
          <span 
            key={type}
            className={`
              px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-md 
              type-${type.toLowerCase()} border border-white/10
              transition-transform duration-200 hover:scale-105
            `}
          >
            {type}
          </span>
        ))}
      </div>

      {/* Botão de captura */}
      <button
        onClick={onToggle}
        className={`
          w-full py-3 rounded-xl font-bold transition-all duration-300 relative z-10 
          shadow-lg border-2 border-white/10 backdrop-blur-sm
          ${caught 
            ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-green-900/50' 
            : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white shadow-gray-900/50'
          }
          transform hover:scale-105 active:scale-95
        `}
      >
        <div className="flex items-center justify-center gap-2">
          {caught ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Capturado</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Capturar</span>
            </>
          )}
        </div>
      </button>

      {/* Efeito de brilho no hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] pokemon-card:hover:translate-x-[100%] transition-transform duration-1000"></div>
    </div>
  )
}