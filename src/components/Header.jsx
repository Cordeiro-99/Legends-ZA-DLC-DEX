export default function Header({ total, captured }) {
  const percentage = total > 0 ? Math.round((captured / total) * 100) : 0;
  
  return (
    <header className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-2xl shadow-xl border-b-4 border-red-800">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-red-600 rounded-full"></div>
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Legends Z-A Pokédex</h1>
            <p className="text-red-100 text-sm">Acompanha a tua jornada</p>
          </div>
        </div>
        
        <div className="text-center sm:text-right bg-white/10 p-4 rounded-xl backdrop-blur-sm">
          <div className="text-sm opacity-90 mb-1">PROGRESSO DA DEX</div>
          <div className="font-bold text-2xl mb-2">{captured}<span className="text-red-200">/</span>{total}</div>
          <div className="w-48 h-3 bg-white/20 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="text-sm mt-1 text-green-300 font-semibold">{percentage}% Completo</div>
        </div>
      </div>
    </header>
  )
}