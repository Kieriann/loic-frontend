import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api'
import { decodeToken } from '../utils/decodeToken'
import HomeTopBar from '../components/Home/HomeTopBar'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const result = await login({ email, password })

      if (result.token) {
        localStorage.setItem('token', result.token)
        onLogin(result.token)
      }
    } catch (err) {
      const status = err.response?.status
      const apiMsg = err.response?.data?.error

      if (status === 403) {
        setError("Ton e-mail n'est pas encore confirmé. Vérifie ta boîte mail.")
      } else if (apiMsg) {
        setError(apiMsg)
      } else {
        setError("Une erreur est survenue. Réessaie plus tard.")
      }
    }
  }

return (
  <div className="min-h-screen py-10 px-4 pt-28">
    <HomeTopBar isConnected={!!localStorage.getItem('token')} />

    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md mt-40">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md">
            {error}
            {error.includes("confirmé") && (
              <button
                type="button"
                className="ml-4 underline text-sm"
                onClick={() => navigate('/confirm-email')}
              >
                Renvoyer le lien
              </button>
            )}
          </div>
        )}


          <label className="block text-darkBlue font-semibold">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkBlue"
          />

          <label className="block text-darkBlue font-semibold">Mot de passe</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            type="password"
            required
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkBlue"
          />

          <button
            type="submit"
            className="bg-darkBlue text-white py-2 rounded-md hover:bg-opacity-90 transition"
          >
            Se connecter
          </button>

          <p className="mt-2 text-center">
            <Link to="/forgot-password" className="text-darkBlue underline">
              Mot de passe oublié ?
            </Link>
          </p>

          <p className="mt-2 text-center">
            Pas encore de compte ?{' '}
            <Link to="/signup" className="text-darkBlue underline">
              S’inscrire
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
