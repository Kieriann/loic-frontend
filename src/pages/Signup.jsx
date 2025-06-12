//
// ─── Page d'inscription utilisateur ───────────────────────────────
//

import React, { useState } from 'react'
import { signup } from '../api'

export default function Signup({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await signup({ email, password })
    if (result.token) {
      localStorage.setItem('token', result.token)
      onLogin(result.token)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="block text-darkBlue font-semibold">Email</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkBlue"
      />

      <label className="block text-darkBlue font-semibold">Mot de passe</label>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        type="password"
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
