import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchAllUserProfiles, fetchDexList } from "../api";
import { Link } from "react-router-dom";

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [dexList, setDexList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user, logout } = useContext(AuthContext);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        if (!token) throw new Error("Not authenticated");

        // Busca todas as estatísticas e a lista de dex
        const [allProfiles, dexListData] = await Promise.all([
          fetchAllUserProfiles(token),
          fetchDexList(token)
        ]);

        setProfileData(allProfiles);
        setDexList(dexListData.dexList || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, [token]);

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja terminar sessão?')) {
      logout();
      window.location.href = '/login';
    }
  };

  if (loading) return (
    <div className="min-h-screen pokemon-bg-colorful p-8 flex items-center justify-center">
      <div className="text-white text-xl">A carregar perfil...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen pokemon-bg-colorful p-8">
      <div className="max-w-4xl mx-auto bg-gray-900/80 rounded-xl p-6">
        <p className="text-red-400 text-xl mb-4">Erro: {error}</p>
        <button 
          onClick={() => window.location.href = "/login"}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Ir para Login
        </button>
      </div>
    </div>
  );

  if (!profileData) return null;

  return (
    <div className="min-h-screen pokemon-bg-colorful p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Perfil do Treinador
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="text-gray-300">
                <span className="text-yellow-300 font-bold">{profileData.username}</span>
              </div>
              {/* CORREÇÃO AQUI: usar user.id em vez de user._id */}
              <div className="text-xs bg-blue-900/50 px-2 py-1 rounded text-blue-300">
                ID: {user?.id?.substring(0, 8) || 'N/A'}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to="/pokedex"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voltar à Pokédex
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Estatísticas Gerais */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700/50 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 p-2 rounded-lg">
              📊
            </span>
            Estatísticas Gerais
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="text-gray-400 text-sm mb-2">Total Capturado</div>
              <div className="text-4xl font-bold text-white">
                {profileData.overall.captured}
              </div>
              <div className="text-gray-500 text-sm mt-1">
                de {profileData.overall.total} Pokémon
              </div>
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="text-gray-400 text-sm mb-2">Progresso Geral</div>
              <div className="text-4xl font-bold text-green-400">
                {profileData.overall.percentage}%
              </div>
              <div className="mt-3">
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000"
                    style={{ width: `${profileData.overall.percentage}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="text-gray-400 text-sm mb-2">Pokédex Ativas</div>
              <div className="text-4xl font-bold text-blue-400">
                {dexList.length}
              </div>
              <div className="text-gray-500 text-sm mt-1">
                diferentes coleções
              </div>
            </div>
          </div>
        </div>

        {/* Todas as Pokédex */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="bg-gradient-to-r from-blue-600 to-green-500 p-2 rounded-lg">
              📚
            </span>
            Todas as Pokédex
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dexList.map((dex, index) => {
              const stats = profileData.stats[dex.id];
              if (!stats) return null;

              // Cores baseadas no tipo de dex
              const colorClasses = {
                'legends-za': 'from-purple-600 to-pink-500',
                'national-dex': 'from-blue-600 to-green-500',
                'shiny-dex': 'from-yellow-600 to-orange-500'
              };

              const bgColor = colorClasses[dex.id] || 'from-gray-600 to-gray-500';

              return (
                <div 
                  key={dex.id}
                  className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-all hover:scale-[1.02]"
                >
                  {/* Cabeçalho da dex */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-bold bg-gradient-to-r ${bgColor}`}>
                        {dex.name}
                      </div>
                      <div className="text-gray-400 text-sm mt-1">
                        {dex.description}
                      </div>
                    </div>
                    <div className="text-gray-300 text-lg font-bold">
                      #{index + 1}
                    </div>
                  </div>

                  {/* Estatísticas */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Progresso</span>
                        <span className="font-bold text-white">{stats.percentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${bgColor} transition-all duration-1000`}
                          style={{ width: `${stats.percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                        <div className="text-2xl font-bold text-white">{stats.captured}</div>
                        <div className="text-xs text-gray-400">Capturados</div>
                      </div>
                      <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                        <div className="text-2xl font-bold text-white">{stats.total}</div>
                        <div className="text-xs text-gray-400">Total</div>
                      </div>
                    </div>

                    <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Faltam</div>
                      <div className="text-xl font-bold text-yellow-400">
                        {stats.total - stats.captured}
                      </div>
                    </div>

                    {/* Link para a dex específica - CORRIGIDO */}
                    <Link
                      to={`/pokedex?dex=${dex.id}`}
                      className={`block text-center py-3 rounded-lg font-bold text-white bg-gradient-to-r ${bgColor} hover:opacity-90 transition-all`}
                    >
                      Ver {dex.name}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumo Detalhado */}
        <div className="mt-8 bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6">Resumo Detalhado</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-300">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-left">Pokédex</th>
                  <th className="py-3 px-4 text-left">Capturados</th>
                  <th className="py-3 px-4 text-left">Faltam</th>
                  <th className="py-3 px-4 text-left">Total</th>
                  <th className="py-3 px-4 text-left">Progresso</th>
                  <th className="py-3 px-4 text-left">Ação</th>
                </tr>
              </thead>
              <tbody>
                {dexList.map(dex => {
                  const stats = profileData.stats[dex.id];
                  if (!stats) return null;

                  return (
                    <tr key={dex.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-white">{dex.name}</div>
                        <div className="text-xs text-gray-500">{dex.description}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-green-400">{stats.captured}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-yellow-400">{stats.total - stats.captured}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-blue-400">{stats.total}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                              style={{ width: `${stats.percentage}%` }}
                            />
                          </div>
                          <span className="font-bold">{stats.percentage}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {/* Link corrigido */}
                        <Link
                          to={`/pokedex?dex=${dex.id}`}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors"
                        >
                          Abrir
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Última atualização: {new Date().toLocaleDateString('pt-PT')}</p>
          <p className="mt-2">
            <span className="text-yellow-400">⭐ Dica:</span> Clique em uma Pokédex para ver detalhes completos
          </p>
        </div>
      </div>
    </div>
  );
}