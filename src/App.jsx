import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "./context/AuthContext"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./Home"
import ProtectedRoute from "./components/ProtectedRoute"
import Profile from "./pages/Profile";



// Componente para rota raiz inteligente
function RootRoute() {
  const { user } = useContext(AuthContext)
  
  // Se estiver logado, vai para pokedex
  // Se não estiver, vai para login
  return <Navigate to={user ? "/pokedex" : "/login"} />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota raiz inteligente */}
        <Route path="/" element={<RootRoute />} />

        {/* auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* pokédex protegida */}
        <Route
          path="/pokedex"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
        <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  )
}