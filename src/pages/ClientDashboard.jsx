import React from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import ClientSidebar from '../components/Client/ClientSidebar' 
import ClientRequestForm from '../components/Client/ClientRequestForm'
import ClientRequestsStatus from '../components/Client/ClientRequestsStatus'
// import ClientMessages from '../components/Client/ClientMessages'
import ClientProfile from '../components/Client/ClientProfile'

export default function ClientDashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'profile'
  const handleTab = (next) => {
    const p = new URLSearchParams(searchParams)
    p.set('tab', next)
    if (next !== 'demande') p.delete('edit')
    setSearchParams(p)
  }
  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <Header onLogout={() => {}} />
        <div className="max-w-6xl mx-auto w-full px-4 pt-8 pb-16 flex flex-col lg:flex-row gap-6 flex-1 items-stretch">
          <aside className="w-full lg:w-64 shrink-0 flex flex-col self-stretch">
          <ClientSidebar activeTab={tab} onChange={handleTab} />
        </aside>

      <main className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col">
        {tab === 'profile' && <ClientProfile />}
        {tab === 'demande' && <ClientRequestForm />}
        {tab === 'statut' && <ClientRequestsStatus />}

        </main>
      </div>
    </div>
  )
}
