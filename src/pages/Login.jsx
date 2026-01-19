import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import * as api from '../api';
import "../login.css";

export default function Login() {
   // Credenciais introduzidas pelo utilizador
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

    // Contexto de autenticação global
  const { user, saveAuth } = useContext(AuthContext);

    // Estados auxiliares
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

/**
   * Função executada ao submeter o formulário de login
   * - Valida o submit
   * - Chama a API
   * - Guarda o token e utilizador
   * - Redireciona para a página principal
   */
  const submit = async (e) => {
    e.preventDefault();
    console.log('🟡 SUBMIT - Login com:', username);
    
    setLoading(true);
    setError(null);
    
    try {
      // Pedido de login á API
      const result = await api.login(username, password);
      console.log('🟡 RESULTADO API:', result);
      
      // Login bem-sucedido
      if (result.token && result.user) {
        console.log('✅ LOGIN BEM-SUCEDIDO');
        saveAuth(result.user, result.token);
        
        // Redirecionamento simples após login
        window.location.href = '/';
        return;
      } 
            // Erros vindos da API
      else if (result.error) {
        console.log('❌ ERRO DA API:', result.error);
        setError(result.error);
      }
      else if (result.message) {
        console.log('❌ MENSAGEM DA API:', result.message);
        setError(result.message);
      }
      else {
        setError('Login falhou');
      }
      
    } catch (err) {
      // Erro de conexão ou inesperado
      console.error('🔥 ERRO:', err);
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  // Se já estiver logado, mostra mensagem
  if (user) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Já está logado!</h2>
            <p>Você já está autenticado como: <strong>{user.username}</strong></p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px'  }}>
              <p style={{ color: '#332C23' }}> Você será redirecionado automaticamente... </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="submit-button"
              style={{ marginTop: '10px' }}
            >
              Ir para a Página Principal
            </button>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="submit-button"
              style={{ 
                marginTop: '10px', 
                backgroundColor: '#ff4444',
                marginLeft: '10px'
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    );
  }
    //Formulário de login
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Bem vindo</h2>
          <p>Faça login para continuar</p>
        </div>
        
        <form onSubmit={submit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="form-input"
              placeholder="Insere o username"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input"
                placeholder="Insere a password"
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading || !username || !password}
          >
            {loading ? 'A fazer login...' : 'Login'}
          </button>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </form>
        
        <div className="login-footer">
          <span style={{ margin: '0 8px' }}>•</span>
          <a href="/register">Criar conta</a>
        </div>
      </div>
    </div>
  );
}