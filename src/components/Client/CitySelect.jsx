import React, { useEffect, useRef, useState } from 'react'

export default function CitySelect({ value, onChange }) {
  const [query, setQuery] = useState(value?.name || '')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const boxRef = useRef(null)

  useEffect(() => {
    const onDocClick = e => {
      if (!boxRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }
    let stop = false
    ;(async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token') || ''
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cities?query=${encodeURIComponent(query)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
          mode: 'cors',
        })
        const data = await res.json()
        if (stop) return
        if (!res.ok) throw new Error(data?.error || 'Erreur villes')
        // attendu: [{id, name, country}] côté backend
        setResults(Array.isArray(data) ? data.slice(0, 50) : [])
        setOpen(true)
      } catch {
        setResults([])
        setOpen(false)
      } finally {
        if (!stop) setLoading(false)
      }
    })()
    return () => {
      stop = true
    }
  }, [query])

  const selectCity = c => {
    onChange?.(c)
    setQuery(`${c.name}, ${c.country}`)
    setOpen(false)
  }

  return (
    <div className="relative" ref={boxRef}>
      <label className="block text-sm text-gray-700 mb-2">Ville</label>
      <input
        type="text"
        value={query}
        onChange={e => {
          setQuery(e.target.value)
          onChange?.(null)
        }}
        onFocus={() => query.length >= 2 && setOpen(true)}
        placeholder="Tapez au moins 2 lettres"
        className="w-full rounded-xl border px-3 py-2"
        autoComplete="off"
      />
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border bg-white shadow">
          {loading && (
            <div className="px-3 py-2 text-sm text-gray-500">Chargement…</div>
          )}
          {!loading && results.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">
              Aucune ville trouvée
            </div>
          )}
          {!loading &&
            results.map(c => (
              <button
                key={c.id || `${c.name}-${c.country}`}
                type="button"
                onClick={() => selectCity(c)}
                className="block w-full text-left px-3 py-2 hover:bg-gray-50"
              >
                {c.name}, {c.country}
              </button>
            ))}
        </div>
      )}
    </div>
  )
}
