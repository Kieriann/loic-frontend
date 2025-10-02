import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || ''


export default function ServiceNeedsList({ onContact }) {
  const [needs, setNeeds] = useState([])
  const [selected, setSelected] = useState({}) // needId => Set(userIds)

const fetchNeeds = async () => {
  try {
    const token = localStorage.getItem('token')
    const { data } = await axios.get(`${API}/api/service-requests/mine`, { headers: { Authorization: `Bearer ${token}` } })
setNeeds((Array.isArray(data) ? data : []).map(n => ({
  ...n,
  shortlist: n.shortlist?.length ? n.shortlist : [{ id: -1, candidateId: 2, status: 'PENDING' }]
})))
  } catch {
    setNeeds([])
  }
}

  useEffect(() => { fetchNeeds() }, [])

  const toggle = (needId, userId) => {
    setSelected(prev => {
      const set = new Set(prev[needId] || [])
      set.has(userId) ? set.delete(userId) : set.add(userId)
      return { ...prev, [needId]: set }
    })
  }
  useEffect(() => {
  const h = () => fetchNeeds()
  window.addEventListener('service-need:created', h)
  return () => window.removeEventListener('service-need:created', h)
}, [])


  const contact = async (needId) => {
    const ids = Array.from(selected[needId] || [])
    if (!ids.length) return
    const token = localStorage.getItem('token')
    await axios.post(`${API}/api/service-requests/${needId}/contact`, { candidateIds: ids }, { headers: { Authorization: `Bearer ${token}` } })
    onContact?.(ids, needId)
  }

  // Ici, la "shortlist" est supposée déjà calculée côté back plus tard.
  // En attendant, on affiche la shortlist stockée si elle existe.
return (
  <div className="mt-6 space-y-4">
    {Array.isArray(needs) && needs.length ? (
      needs.map(need => (
        <div key={need.id} className="rounded-2xl border p-4 bg-white">
          <div className="font-semibold mb-2">Demande #{need.id}</div>
          <div className="text-sm opacity-70 mb-2">{need.description}</div>

          {!!need.items?.length && (
            <div className="text-xs opacity-60 mb-2">
              {need.items.map(it => `${it.skillLabel} (${it.level})`).join(' · ')}
            </div>
          )}

          {!!need.shortlist?.length ? (
            <div className="space-y-1">
              {need.shortlist.map(s => (
                <label key={s.id} className="flex items-center gap-2">
                <input
                type="checkbox"
                checked={selected[need.id]?.has(s.candidateId) || false}
                onChange={() => toggle(need.id, s.candidateId)}
                />
                  <span>Indep {s.candidateId}</span>
                  <span className="text-xs opacity-60">({s.status})</span>
                </label>
              ))}

              <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => window.location.assign(`/profile?tab=messages&otherId=26&fromNeed=${need.id}`)}
                className="text-blue-600 underline text-xs"
              >
                Ouvrir la messagerie (ID 26)
              </button>


                <button
                className="btn btn-primary"
                disabled={!selected[need.id] || selected[need.id].size === 0}
                onClick={() => contact(need.id)}
                >
                Contacter
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm opacity-60">Shortlist vide (on la remplira automatiquement plus tard).</div>
          )}
        </div>
      ))
    ) : (
      <div className="text-sm opacity-60">Aucune demande (ou non connecté).</div>
    )}
  </div>
)
}