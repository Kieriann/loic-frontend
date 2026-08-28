//
// ─── Pied de page avec CGU ─────────────────────────────────────────────
//

import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="text-center text-sm text-gray-500 py-6">
      <p>
        © {new Date().getFullYear()} Free's Biz ·{' '}
        <Link to="/cgu" className="underline hover:text-gray-700">
          CGU
        </Link>{' '}
        · Protection des données
      </p>
    </footer>
  )
}
