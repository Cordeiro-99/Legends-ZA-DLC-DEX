const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
} );

export async function register(username, password) {
  console.log('📡 [REGISTER] Chamando:', { username });
  
  try {
    const res = await fetch(API_BASE + '/auth/register', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ username, password })
    });
    
    console.log('📡 [REGISTER] Status:', res.status, res.statusText);
    const data = await res.json();
    console.log('📡 [REGISTER] Resposta:', data);
    
    return data;
  } catch (error) {
    console.error('📡 [REGISTER] Erro:', error);
    throw error;
  }
}

export async function login(username, password) {
  console.log('📡 [LOGIN] Iniciando chamada');
  console.log('📡 [LOGIN] Credenciais:', { username, password: password ? '***' : 'vazia' });
  console.log('📡 [LOGIN] URL completa:', `${API_BASE}/auth/login`);
  
  try {
    const startTime = Date.now();
    
    const res = await fetch(API_BASE + '/auth/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ username, password })
    });
    
    const endTime = Date.now();
    console.log('📡 [LOGIN] Tempo de resposta:', `${endTime - startTime}ms`);
    console.log('📡 [LOGIN] Status:', res.status, res.statusText);
    console.log('📡 [LOGIN] OK?', res.ok);
    
    // Log headers
    console.log('📡 [LOGIN] Content-Type:', res.headers.get('content-type'));
    
    const text = await res.text();
    console.log('📡 [LOGIN] Resposta bruta:', text);
    
    let data;
    try {
      data = JSON.parse(text);
      console.log('📡 [LOGIN] JSON parseado:', data);
    } catch (parseError) {
      console.error('📡 [LOGIN] ERRO parse JSON:', parseError);
      console.error('📡 [LOGIN] Texto que falhou:', text);
      return { error: 'Invalid server response' };
    }
    
    // Adiciona um campo 'error' se a resposta não for ok
    if (!res.ok) {
      console.log('📡 [LOGIN] Resposta não OK - retornando erro:', data.message || 'Login failed');
      return { 
        error: data.message || 'Login failed',
        status: res.status,
        data: data
      };
    }
    
    console.log('📡 [LOGIN] Sucesso - retornando dados:', {
      hasToken: !!data.token,
      hasUser: !!data.user,
      tokenPreview: data.token ? `${data.token.substring(0, 30)}...` : 'N/A',
      user: data.user
    });
    
    return data; // { token, user }
  } catch (error) {
    console.error('📡 [LOGIN] ERRO no fetch:', error);
    console.error('📡 [LOGIN] Mensagem:', error.message);
    console.error('📡 [LOGIN] Stack:', error.stack);
    
    return { 
      error: 'Network error: ' + error.message,
      isNetworkError: true
    };
  }
}

export async function fetchPokedex(token) {
  console.log('📡 [POKEDEX] Fetch com token:', token ? `${token.substring(0, 20)}...` : 'N/A');
  
  try {
    const res = await fetch(API_BASE + '/pokedex', {
      headers: { Authorization: 'Bearer ' + token }
    });
    
    console.log('📡 [POKEDEX] Status:', res.status);
    const data = await res.json();
    console.log('📡 [POKEDEX] Resposta:', data);
    
    // Garantir que todas as chaves de Pokédex existem
    if (data?.pokedex) {
      data.pokedex = {
        'legends-za': data.pokedex['legends-za'] || {},
        'national-dex': data.pokedex['national-dex'] || {},
        'shiny-dex': data.pokedex['shiny-dex'] || {}
      };
    }
    
    return data;
  } catch (error) {
    console.error('📡 [POKEDEX] Erro:', error);
    throw error;
  }
}

export async function updatePokedex(token, pokedexUpdates) {
  console.log('📡 [UPDATE POKEDEX] Chamando:', { 
    hasToken: !!token,
    updates: pokedexUpdates,
    dexKeys: Object.keys(pokedexUpdates)
  });
  
  try {
    // Envia apenas as atualizações para o servidor
    // pokedexUpdates deve ser algo como: { 'legends-za': { '25': true } }
    const res = await fetch(API_BASE + '/pokedex/update', {
      method: 'PUT',
      headers: { 
        'Content-Type':'application/json', 
        Authorization: 'Bearer ' + token 
      },
      body: JSON.stringify({ pokedex: pokedexUpdates })
    });
    
    console.log('📡 [UPDATE POKEDEX] Status:', res.status);
    const data = await res.json();
    console.log('📡 [UPDATE POKEDEX] Resposta:', data);
    
    return data;
  } catch (error) {
    console.error('📡 [UPDATE POKEDEX] Erro:', error);
    throw error;
  }
}

// Funções para perfil do usuário
export async function fetchUserProfile(token, dex = 'legends-za') {
  console.log('📡 [PROFILE] Fetch profile para dex:', dex);
  
  try {
    const res = await fetch(`${API_BASE}/user/profile?dex=${dex}`, {
      headers: { Authorization: 'Bearer ' + token }
    });
    
    console.log('📡 [PROFILE] Status:', res.status);
    const data = await res.json();
    console.log('📡 [PROFILE] Resposta:', data);
    
    return data;
  } catch (error) {
    console.error('📡 [PROFILE] Erro:', error);
    throw error;
  }
}

export async function fetchAllUserProfiles(token) {
  console.log('📡 [PROFILE ALL] Fetch todas as dex');
  
  try {
    const res = await fetch(`${API_BASE}/user/profile/all`, {
      headers: { Authorization: 'Bearer ' + token }
    });
    
    console.log('📡 [PROFILE ALL] Status:', res.status);
    const data = await res.json();
    console.log('📡 [PROFILE ALL] Resposta:', data);
    
    return data;
  } catch (error) {
    console.error('📡 [PROFILE ALL] Erro:', error);
    throw error;
  }
}

export async function fetchDexList(token) {
  console.log('📡 [DEX LIST] Fetch lista de dex');
  
  try {
    const res = await fetch(`${API_BASE}/user/profile/dex-list`, {
      headers: { Authorization: 'Bearer ' + token }
    });
    
    console.log('📡 [DEX LIST] Status:', res.status);
    const data = await res.json();
    console.log('📡 [DEX LIST] Resposta:', data);
    
    return data;
  } catch (error) {
    console.error('📡 [DEX LIST] Erro:', error);
    throw error;
  }
}

// Exporta também a API_BASE para debug
export { API_BASE };