//
// ─── Point d'entrée principal de l'application React ──────────────
//

import React, { useEffect, useState } from 'react'
import Signup from './pages/Signup'
import Login from './pages/Login'
import EditProfilePage from './pages/EditProfilePage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import AdminProfilDetail from './pages/AdminProfilDetail'
import CenteredLayout from './components/CenteredLayout'
import logo from './assets/logo.png'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from 'react-router-dom'
import { fetchProfile } from './api'

//
// ─── En-tête avec logo et menu utilisateur ─────────────────────────
//

function Header() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
  localStorage.removeItem('token')
  setToken(null)
  navigate('/login') 
}

  return (
    <header className="bg-primary py-6 relative">
      <div className="flex justify-center items-center relative">
        <img src={logo} alt="Logo Free's Biz" className="h-60" />
        <div className="absolute right-6 top-1/2 -translate-y-1/2">
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full bg-white text-darkBlue font-bold border border-darkBlue hover:bg-darkBlue hover:text-white transition"
            title="Menu"
          >
            ≡
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow border border-gray-200 z-50">
              <button
                onClick={() => navigate('/profile')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-darkBlue"
              >
                Voir mon profil
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-darkBlue"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

//
// ─── Gestion des routes selon le rôle (admin ou normal) ────────────
//

function AppRouter({ token, setToken }) {
  const [mode, setMode] = useState('login')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    const getProfile = async () => {
      try {
        const res = await fetchProfile(token)
        setUser({ isAdmin: res.isAdmin })
      } catch (err) {
        localStorage.removeItem('token')
        setToken(null)
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [token, setToken])

  if (!token) {
    return (
      <>
        <Header />
        <CenteredLayout>
          <h1 className="text-2xl font-bold text-darkBlue mb-6 text-center">
            {mode === 'signup' ? 'Inscription' : 'Connexion'}
          </h1>
          {mode === 'signup' ? (
            <>
              <Signup onLogin={setToken} />
              <p className="mt-4 text-center">
                Déjà inscrit ?{' '}
                <button className="text-darkBlue underline" onClick={() => setMode('login')}>
                  Se connecter
                </button>
              </p>
            </>
          ) : (
            <>
              <Login onLogin={setToken} />
              <p className="mt-4 text-center">
                Pas encore de compte ?{' '}
                <button className="text-darkBlue underline" onClick={() => setMode('signup')}>
                  S’inscrire
                </button>
              </p>
            </>
          )}
        </CenteredLayout>
      </>
    )
  }

  if (loading || !user) return <p className="p-4">Chargement...</p>

  return (
    <>
      <Header />
      <Routes>
        {user.isAdmin ? (
          <>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/profil/:id" element={<AdminProfilDetail />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </>
        ) : (
          <>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="*" element={<Navigate to="/profile" replace />} />
          </>
        )}
      </Routes>
    </>
  )
}

//
// ─── Initialisation de l'application ───────────────────────────────
//

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))

  return (
    <Router>
      <AppRouter token={token} setToken={setToken} />
    </Router>
  )
}

export default App
