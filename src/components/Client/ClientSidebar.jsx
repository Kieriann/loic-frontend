import React from 'react'
import cx from 'classnames'

const tabs = [
  { key: 'demande', label: 'Faire une demande' },
  { key: 'statut', label: 'Statut de mes demandes' },
  { key: 'messages', label: 'Messagerie' },
]

export default function ClientSidebar({ activeTab, onChange }) {
  return (
    <nav className="rounded-2xl border border-blue-200 bg-white p-3 shadow-md h-full flex flex-col">
      <ul className="space-y-2">
        {tabs.map(t => (
          <li key={t.key}>
            <button
              type="button"
              onClick={() => onChange(t.key)}
              className={cx(
                'w-full text-left px-4 py-2 rounded-xl transition',
                activeTab === t.key
                  ? 'bg-blue-100 text-darkBlue font-semibold'
                  : 'text-darkBlue hover:bg-blue-50'
              )}
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
