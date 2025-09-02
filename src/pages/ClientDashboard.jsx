import React, { useState } from 'react'
import Header from '../components/Header'
import ClientSidebar from '../components/Client/ClientSidebar' 
import ClientRequestForm from '../components/Client/ClientRequestForm'
import ClientRequestsStatus from '../components/Client/ClientRequestsStatus'
import ClientMessages from '../components/Client/ClientMessages'

export default function ClientDashboard() {
  const [tab, setTab] = useState('demande') // 'demande' | 'statut' | 'messages'
  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogout={() => {}} />
        <div className="max-w-6xl mx-auto w-full px-4 pt-8 pb-16 flex flex-col lg:flex-row gap-6 flex-1 items-stretch">
          <aside className="w-full lg:w-64 shrink-0 flex flex-col self-stretch">
          <ClientSidebar activeTab={tab} onChange={setTab} />
        </aside>

      <main className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col">
          {tab === 'demande' && <ClientRequestForm />}
          {tab === 'statut' && <ClientRequestsStatus />}
          {tab === 'messages' && <ClientMessages />}
        </main>
      </div>
    </div>
  )
}
