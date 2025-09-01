import React, { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useLocation,
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
import { fetchProfile } from './api'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import SessionManager from './components/SessionManager'
import Footer from './components/Footer'
import Cgu from './pages/Cgu'
import Home from './pages/Home'
import Stats from './pages/Stats'
import Indep from './pages/Indep'
import Entreprise from './pages/Entreprise'
import HomeTopBar from './components/Home/HomeTopBar'
import Header from './components/Header'
import ClientDashboard from './pages/ClientDashboard'


function AppRouter({ token, setToken }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

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

  return (
    <>


{token && !user?.isAdmin && <Header onLogout={setToken} />}

{!token ? (
  <>

          <Routes>
            <Route path="/" element={<Home />} />
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
            <Route path="/signup-success" element={<CenteredLayout><SignupSuccess /></CenteredLayout>} />
            <Route path="/confirm-email" element={<CenteredLayout><ConfirmEmailPage /></CenteredLayout>} />
            <Route path="/forgot-password" element={<CenteredLayout><ForgotPasswordPage /></CenteredLayout>} />
            <Route path="/reset-password/:token" element={<CenteredLayout><ResetPasswordPage /></CenteredLayout>} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/indep" element={<Indep />} />
            <Route path="/entreprise" element={<Entreprise />} />
            <Route path="/cgu" element={<Cgu />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/login-indep" element={<Login expectedRole="INDEP" />} />
            <Route path="/login-client" element={<Login expectedRole="CLIENT" />} />
            <Route path="/client" element={<ClientDashboard />} />
          </Routes>
          <Footer />
        </>
      ) : (
        <>
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
      )}
    </>
  )
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))

  return (
    <BrowserRouter>
      <SessionManager>
        <AppRouter token={token} setToken={setToken} />
      </SessionManager>
    </BrowserRouter>
  )
}

export default App
