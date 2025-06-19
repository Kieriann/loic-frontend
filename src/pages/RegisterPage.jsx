// src/pages/RegisterPage.jsx

import React, { useState } from 'react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (res.ok) {
        setSuccess(true)
      } else {
        const { error } = await res.json()
        setError(error || 'Erreur inattendue')
      }
    } catch {
      setError('Impossible de contacter le serveur')
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary px-4">
        <div className="bg-white p-6 rounded shadow text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Inscription réussie</h1>
          <p>Merci d’aller valider votre inscription dans vos mails.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-md w-full space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">S’inscrire</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-darkBlue text-white py-2 rounded hover:bg-blue-800"
        >
          S’inscrire
        </button>
      </form>
    </div>
  )
}
