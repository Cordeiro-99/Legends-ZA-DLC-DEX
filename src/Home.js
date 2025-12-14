import React, { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

export default function Home(){
  const { user, pokedex, toggleCaught, logout } = useContext(AuthContext);
  return (
    <div>
      <h1>Bem-vindo, {user?.username}</h1>
      <button onClick={logout}>Logout</button>
      <h2>Tua Pokédex (mostrando os ids capturados)</h2>
      <div style={{display:'flex',flexWrap:'wrap'}}>
        {Object.keys(pokedex).length === 0 && <p>Nenhum pokemon marcado</p>}
        {Object.keys(pokedex).map(pid => (
          <div key={pid} style={{border:'1px solid #ccc', padding:8, margin:4}}>
            <div>#{pid}</div>
            <div>{pokedex[pid] ? 'Capturado' : 'Não'}</div>
            <button onClick={()=>toggleCaught(pid)}>Toggle</button>
          </div>
        ))}
      </div>
    </div>
  );
}
