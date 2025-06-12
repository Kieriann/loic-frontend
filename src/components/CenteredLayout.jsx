//
// ─── Mise en page centrée pour les pages (ex: login/signup) ───────
//

import React from 'react'

export default function CenteredLayout({ children }) {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 pt-0">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md self-start mt-4">
        {children}
      </div>
    </div>
  )
}
