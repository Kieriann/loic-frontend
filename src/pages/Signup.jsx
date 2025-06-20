import React, { useState } from 'react'
import { signup } from '../api'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      const result = await signup({ email, password })
      if (result.token) {
        setSubmitted(true)
      }
    } catch (err) {
      setError(err.error || 'Échec de l’inscription')
    }
  }

  if (submitted) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-semibold">Inscription réussie !</h1>
        <p>Merci : vérifiez vos mails pour confirmer votre adresse.</p>
      </div>
    )
  }

  return (
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
    </form>
  )
}
