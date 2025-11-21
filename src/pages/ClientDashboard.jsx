import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import ClientSidebar from '../components/Client/ClientSidebar'
import ClientRequestForm from '../components/Client/ClientRequestForm'
import ClientRequestsStatus from '../components/Client/ClientRequestsStatus'
import ClientProfile from '../components/Client/ClientProfile'
import {
  listClientSavedSearches,
  updateClientSavedSearch,
  deleteClientSavedSearch,
} from '../api/clientSavedSearches'

export default function ClientDashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'profile'

  const [savedSearches, setSavedSearches] = useState([])
  const [selectedSavedSearch, setSelectedSavedSearch] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const rows = await listClientSavedSearches()
        setSavedSearches(rows)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  const handleTab = (next) => {
    const p = new URLSearchParams(searchParams)
    p.set('tab', next)
    if (next !== 'demande') p.delete('edit')
    setSearchParams(p)
  }

  const handleSelectSavedSearch = (search) => {
    setSelectedSavedSearch(search)
    const p = new URLSearchParams(searchParams)
    p.set('tab', 'demande')
    setSearchParams(p)
  }

const handleRenameSavedSearch = async (id, newName) => {
  try {
    const updated = await updateClientSavedSearch(id, { name: newName })
    setSavedSearches(prev =>
      prev.map(s => (s.id === id ? updated : s))
    )
    if (selectedSavedSearch && selectedSavedSearch.id === id) {
      setSelectedSavedSearch(updated)
    }
  } catch (e) {
    console.error(e)
  }
}

const handleDeleteSavedSearch = async (id) => {
  try {
    await deleteClientSavedSearch(id)
    setSavedSearches(prev => prev.filter(s => s.id !== id))
    if (selectedSavedSearch && selectedSavedSearch.id === id) {
      setSelectedSavedSearch(null)
    }
  } catch (e) {
    console.error(e)
  }
}


  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <Header onLogout={() => {}} />
      <div className="max-w-6xl mx-auto w-full px-4 pt-8 pb-16 flex flex-col lg:flex-row gap-6 flex-1 items-stretch">
        <aside className="w-full lg:w-64 shrink-0 flex flex-col self-stretch">
          <ClientSidebar
            activeTab={tab}
            onChange={handleTab}
            savedSearches={savedSearches}
            onSelectSavedSearch={handleSelectSavedSearch}
            onRenameSavedSearch={handleRenameSavedSearch}
            onDeleteSavedSearch={handleDeleteSavedSearch}
          />
        </aside>

        <main className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col">
          {tab === 'profile' && <ClientProfile />}
          {tab === 'demande' && (
            <ClientRequestForm selectedSavedSearch={selectedSavedSearch} />
          )}
          {tab === 'statut' && <ClientRequestsStatus />}
        </main>
      </div>
    </div>
  )
}
