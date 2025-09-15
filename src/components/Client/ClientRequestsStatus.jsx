import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getClientRequests } from '../../api/clientRequests'

// ─── Mapping statut → libellé + style ──────────────────────────────
const statusMap = {
  0: { label: 'non traité', cls: 'bg-gray-100 text-gray-700 border border-gray-200' },
  1: { label: 'en cours de traitement', cls: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
  2: { label: 'traité', cls: 'bg-green-50 text-green-700 border border-green-200' },
  PENDING: { label: 'non traité', cls: 'bg-gray-100 text-gray-700 border border-gray-200' },
  IN_PROGRESS: { label: 'en cours de traitement', cls: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
   DONE: { label: 'proposition envoyée', cls: 'bg-green-50 text-green-700 border border-green-200' },
}

// ─── Normalisation du statut ───────────────────────────────────────
function getStatusMeta(status) {
  const key = typeof status === 'string' ? status.toUpperCase() : status
  return statusMap[key] || statusMap.IN_PROGRESS
}


export default function ClientRequestsStatus() {
  const [items, setItems] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getClientRequests().then(setItems).catch(console.error)
  }, [])

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-semibold">Statut de mes demandes</h1>

      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">ID</th>
              <th className="px-4 py-3 font-medium text-gray-600">Statut</th>
              <th className="px-4 py-3 font-medium text-gray-600">Actions</th>

            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-gray-500" colSpan={2}>
                  Aucune demande pour le moment.
                </td>
              </tr>
            ) : (
              items.map(row => {
                const meta = getStatusMeta(row.status)
                return (
                  <tr key={row.id} className="border-t">
                    <td className="px-4 py-3 font-mono">{row.id}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs ${meta.cls}`}>
                        {meta.label}
                      </span>
                    </td>
                                      <td className="px-4 py-3">
                      <button
                      onClick={() => navigate('/client?tab=demande&edit=' + row.id)}
                        className="rounded-lg border px-3 py-1 text-sm"
                      >
                        Modifier
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
