import React, { useState } from 'react'
import Header from '../components/Header'
import ClientSidebar from '../components/Client/ClientSidebar' 

export default function ClientDashboard() {
  const [tab, setTab] = useState('demande') // 'demande' | 'statut' | 'messages'
  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogout={() => {}} />
      <div className="max-w-6xl mx-auto w-full px-4 pt-8 pb-16 flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-64 shrink-0">
          <ClientSidebar activeTab={tab} onChange={setTab} />
        </aside>
        
        <main className="flex-1">
          {tab === 'demande' && (
            <section>
              <h1 className="text-2xl font-bold text-darkBlue mb-4">Faire une demande</h1>
              <p className="text-sm text-gray-600">techno, niveau, localisation.</p>
            </section>
          )}
          {tab === 'statut' && (
            <section>
              <h1 className="text-2xl font-bold text-darkBlue mb-4">Statut de mes demandes</h1>
              <p className="text-sm text-gray-600">Liste et état.</p>
            </section>
          )}
          {tab === 'messages' && (
            <section>
              <h1 className="text-2xl font-bold text-darkBlue mb-4">Messagerie</h1>
              <p className="text-sm text-gray-600">Conversations.</p>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
