import React from 'react'
import ClientTopBar from '../components/Client/ClientTopBar'

export default function ClientDashboard() {
  return (
    <div className="min-h-screen">
      <ClientTopBar />
      <main className="pt-24 max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-darkBlue">Tableau de bord client</h1>
        <p className="mt-4">Ici, vous verrez vos demandes, propositions reçues et favoris.</p>
      </main>
    </div>
  )
}
