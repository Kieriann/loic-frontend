import React, { useState } from 'react'
import { signup } from '../api'
import HomeTopBar from '../components/Home/HomeTopBar'
import { Link } from 'react-router-dom'

export default function Signup({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      const result = await signup({ email, password })
      if (result.message) {
        setSubmitted(true)
      } else {
        setError('Échec de l’inscription')
      }
    } catch (err) {
      console.error(err)
      setError('Échec de l’inscription')
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen py-10 px-4 pt-28">
        <HomeTopBar isConnected={!!localStorage.getItem('token')} />
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md mt-40 text-center">
          <h1 className="text-2xl font-semibold">Inscription réussie !</h1>
          <p className="mt-4">Merci : vérifiez vos mails pour confirmer votre adresse.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10 px-4 pt-28">
      <HomeTopBar isConnected={!!localStorage.getItem('token')} />

      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md mt-40">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="text-red-600">{error}</p>}

          <label className="block text-darkBlue font-semibold">Email</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkBlue"
          />

          <label className="block text-darkBlue font-semibold">Mot de passe</label>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mot de passe"
            type="password"
            required
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkBlue"
          />

          <button
            type="submit"
            className="bg-darkBlue text-white py-2 rounded-md hover:bg-opacity-90 transition"
          >
            S’inscrire
          </button>

          <p className="mt-2 text-center">
            Déjà inscrit ?{' '}
            <Link to="/login" className="text-darkBlue underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
