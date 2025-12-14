import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import * as api from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { saveAuth } = useContext(AuthContext);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.login(username, password);
    if(res.token) {
      saveAuth(res.user, res.token);
    } else {
      setError(res.error || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <label>Username
          <input value={username} onChange={e=>setUsername(e.target.value)} />
        </label>
        <label>Password
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </label>
        <button type="submit">Login</button>
        {error && <p style={{color:'red'}}>{error}</p>}
      </form>
    </div>
  );
}
