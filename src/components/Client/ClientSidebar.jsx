import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import axios from 'axios'

const tabs = [
  { key: 'profile', label: 'Profil' },
  { key: 'demande', label: 'Faire une demande' },
  { key: 'statut', label: 'Statut de mes demandes' },
// { key: 'messages', label: 'Messagerie' },

]

export default function ClientSidebar({ activeTab, onChange }) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchCount = () => {
      axios.get('/api/messages/unread/count', { withCredentials: true })
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
    </nav>
  )
}
