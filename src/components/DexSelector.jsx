import { useState, useEffect } from 'react'

const DexSelector = ({ currentDex, onDexChange }) => {
  const [dexList, setDexList] = useState(['Legends Z-A', 'National Dex', 'Shiny Dex'])

  const handleDexSelect = (dexName) => {
    onDexChange(dexName)
  }

  return (
    <div className="dex-selector bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-700/50">
      <div className="flex items-center justify-between mb-3">
        <div className="text-white font-semibold">Selecionar Dex:</div>
        <div className={`px-3 py-1 rounded-full text-sm font-bold ${
          currentDex === 'Legends Z-A' 
            ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' 
            : currentDex === 'National Dex'
            ? 'bg-gradient-to-r from-blue-600 to-green-500 text-white'
            : 'bg-gradient-to-r from-yellow-600 to-orange-500 text-white'
        }`}>
          {currentDex}
        </div>
      </div>
      
      <div className="dex-buttons flex flex-wrap gap-2">
        {dexList.map(dex => (
          <button
            key={dex}
            className={`dex-btn px-4 py-2 rounded-lg border-2 transition-all font-bold ${
              currentDex === dex 
                ? dex === 'Legends Z-A'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white border-purple-500' 
                  : dex === 'National Dex'
                  ? 'bg-gradient-to-r from-blue-600 to-green-500 text-white border-blue-500'
                  : 'bg-gradient-to-r from-yellow-600 to-orange-500 text-white border-yellow-500'
                : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:border-gray-500'
            }`}
            onClick={() => handleDexSelect(dex)}
          >
            {dex}
          </button>
        ))}
      </div>
    </div>
  )
}

export default DexSelector