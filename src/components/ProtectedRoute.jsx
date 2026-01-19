import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, token } = useContext(AuthContext)

  // 🔹 Ainda a carregar sessão (refresh)
  if (token === null) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#ccc' }}>
        A verificar sessão...
      </div>
    )
  }

  // 🔹 Não autenticado
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // 🔹 Autenticado
  return children
}
