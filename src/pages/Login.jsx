import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import * as api from '../api';
import "../login.css";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { saveAuth } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.login(username, password);
      if(res.token) {
        saveAuth(res.user, res.token);
      } else {
        setError(res.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Bem vindo</h2>
          <p>Faça login para continuar</p>
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
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
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