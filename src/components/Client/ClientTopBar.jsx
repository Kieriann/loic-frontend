import React from 'react'
import { Link } from 'react-router-dom'

export default function ClientTopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <nav className="flex items-center gap-6">
          <Link to="/client" className="font-semibold text-darkBlue">Espace client</Link>
          <Link to="/client/demandes" className="text-darkBlue/80 hover:text-darkBlue">Mes demandes</Link>
          <Link to="/client/favoris" className="text-darkBlue/80 hover:text-darkBlue">Favoris</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm underline">Retour site</Link>
        </div>
      </div>
    </header>
  )
}
