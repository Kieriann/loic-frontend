import React, { useState } from 'react'
import { setSponsorEmail } from '../api'

export default function SponsorModal({ open, onClose, token }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)

  if (!open) return null

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await setSponsorEmail(token, email)
      setOk(true)
      setTimeout(onClose, 800)
    } catch (err) {
      setError(err?.error || 'Erreur')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Vous avez un parrain?</h2>
        <p className="mb-4 text-sm">Renseignez l’e‑mail de votre parrain.</p>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="email@exemple.com"
            className="w-full rounded-lg border px-3 py-2"
            required
          />
          {error && <div className="text-sm text-red-600">{error}</div>}
          {ok && <div className="text-sm text-green-600">Parrain enregistré.</div>}
          <p className="text-xs text-gray-500">Vous pouvez renseigner cette information plus tard.</p>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2">Plus tard</button>
            <button type="submit" className="rounded-lg bg-blue-500 px-4 py-2 text-white">Valider</button>
          </div>
        </form>
      </div>
    </div>
  )
}
