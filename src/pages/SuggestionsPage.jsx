import React, { useState } from 'react'
import { createSuggestion } from '../api/suggestions'

export default function SuggestionsPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    setLoading(true)
    try {
      const { id } = await createSuggestion({ title, content })
      setMessage(`Suggestion enregistrée (ID ${id}).`)
      setTitle('')
      setContent('')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Suggestions</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Titre — ce que vous proposez d’ajouter ou d’améliorer"
          className="w-full border rounded-lg px-3 py-2 text-sm placeholder-gray-500"
          maxLength={150}
          required
        />
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Expliquez votre idée (contexte, besoin, impact attendu)…"
          className="w-full h-40 border rounded-lg px-3 py-2 text-sm placeholder-gray-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white disabled:opacity-50"
        >
          {loading ? 'Envoi…' : 'Envoyer la suggestion'}
        </button>
      </form>

      {message ? (
        <p className="mt-3 text-sm">{message}</p>
      ) : null}
    </div>
  )
}
