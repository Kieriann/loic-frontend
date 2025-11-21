import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import axios from 'axios'

const tabs = [
  { key: 'profile', label: 'Profil' },
  { key: 'demande', label: 'Faire une demande' },
]

export default function ClientSidebar({
  activeTab,
  onChange,
  savedSearches = [],
  onSelectSavedSearch,
  onRenameSavedSearch,
  onDeleteSavedSearch,
}) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')

  useEffect(() => {
    const fetchCount = () => {
      axios
        .get('/api/messages/unread/count', { withCredentials: true })
        .then(res => setUnreadCount(res.data.unreadCount))
        .catch(err => console.error(err))
    }
    fetchCount()
    const interval = setInterval(fetchCount, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <nav className="rounded-2xl border border-blue-200 bg-white p-3 shadow-md h-full flex flex-col">
      <ul className="space-y-2">
        {tabs.map(t => (
          <li key={t.key}>
            <button
              type="button"
              onClick={() => onChange(t.key)}
              className={cx(
                'w-full text-left px-4 py-2 rounded-xl transition flex justify-between items-center',
                activeTab === t.key
                  ? 'bg-blue-100 text-darkBlue font-semibold'
                  : 'text-darkBlue hover:bg-blue-50'
              )}
            >
              <span>{t.label}</span>
              {t.key === 'messages' && unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {activeTab === 'demande' && savedSearches.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <div className="text-xs text-gray-500 uppercase mb-2 pl-1">
            Recherches enregistrées
          </div>

          <ul className="space-y-1">
            {savedSearches.map(s => (
              <li key={s.id} className="flex items-center justify-between gap-1">
                {editingId === s.id ? (
                  <input
                    type="text"
                    autoFocus
                    className="flex-1 text-sm border rounded px-1 py-0.5"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    onBlur={() => {
                      const name = editingName.trim()
                      if (name && name !== s.name && onRenameSavedSearch) {
                        onRenameSavedSearch(s.id, name)
                      }
                      setEditingId(null)
                      setEditingName('')
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.currentTarget.blur()
                      }
                      if (e.key === 'Escape') {
                        setEditingId(null)
                        setEditingName('')
                      }
                    }}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectSavedSearch && onSelectSavedSearch(s)}
                    className="flex-1 text-left text-sm text-darkBlue hover:underline px-1 py-0.5"
                  >
                    {s.name}
                  </button>
                )}

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(s.id)
                      setEditingName(s.name)
                    }}
                    className="p-1 rounded hover:bg-gray-100"
                    title="Renommer"
                  >
                    <span role="img" aria-label="Renommer">✏️</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteSavedSearch && onDeleteSavedSearch(s.id)}
                    className="p-1 rounded hover:bg-gray-100"
                    title="Supprimer"
                  >
                    <span role="img" aria-label="Supprimer">🗑️</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}
