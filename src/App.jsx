//
// ─── Point d'entrée principal de l'application React ──────────────
//

import React, { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from 'react-router-dom'

import Signup from './pages/Signup'
import SignupSuccess from './pages/SignupSuccess'
import Login from './pages/Login'
import ConfirmEmailPage from './pages/ConfirmEmailPage'
import EditProfilePage from './pages/EditProfilePage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import AdminProfilDetail from './pages/AdminProfilDetail'
import CenteredLayout from './components/CenteredLayout'
import logo from './assets/logo.png'
import { fetchProfile } from './api'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import SessionManager from './components/SessionManager'
import Footer from './components/Footer'
import Cgu from './pages/Cgu'




//
// ─── En-tête avec logo et menu utilisateur ─────────────────────────
//

function Header({ onLogout }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    onLogout(null)
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
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    fetchProfile(token)
      .then(res => setUser({ isAdmin: res.isAdmin }))
      .catch(() => {
        localStorage.removeItem('token')
        setToken(null)
      })
      .finally(() => setLoading(false))
  }, [token, setToken])

  if (loading) return <p className="p-4">Chargement…</p>

  // ─── Routes publiques (inscription, connexion, confirmation) ─────
  if (!token) {
    return (
      <>
        <Header onLogout={() => setToken(null)} />
        <CenteredLayout>
          <Routes>
            <Route
              path="/login"
              element={
                <>
                  <Login
                    onLogin={t => {
                      localStorage.setItem('token', t)
                      setToken(t)
                    }}
                  />
                  <p className="mt-4 text-center">
                    Pas encore de compte ?{' '}
                    <Link to="/signup" className="text-darkBlue underline">
                      S’inscrire
                    </Link>
                  </p>
                </>
              }
            />
            <Route
              path="/signup"
              element={
                <>
                  <Signup
                    onLogin={t => {
                      localStorage.setItem('token', t)
                      setToken(t)
                    }}
                  />
                  <p className="mt-4 text-center">
                    Déjà inscrit ?{' '}
                    <Link to="/login" className="text-darkBlue underline">
                      Se connecter
                    </Link>
                  </p>
                </>
              }
            />
            <Route
              path="/signup-success"
              element={<SignupSuccess />}
            />
            <Route path="/confirm-email" element={<ConfirmEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
            <Route path="/cgu" element={<Cgu />} />
          </Routes>
          <Footer />
        </CenteredLayout>
      </>
    )
  }

  // ─── Routes privées après authentification ────────────────────────
  return (
    <>
      <Header onLogout={setToken} />
      <Routes>
        {user?.isAdmin ? (
          <>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/profil/:id" element={<AdminProfilDetail />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </>
        ) : (
          <>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/confirm-email" element={<ConfirmEmailPage />} />
            <Route path="*" element={<Navigate to="/profile" replace />} />
          </>
        )}
      </Routes>
      <Footer />
    </>
  )
}

//
// ─── Initialisation de l'application ───────────────────────────────
//

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))

  return (
    <BrowserRouter>
      <AppRouter token={token} setToken={setToken} />
    </BrowserRouter>
  )
}

export default App
