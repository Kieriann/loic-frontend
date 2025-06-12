//
// ─── En-tête avec logo centré ─────────────────────────────────────
//

import React from 'react'
import logo from '../assets/logo.png' 

export default function Header() {
  return (
    <header className="bg-primary py-6">
      <div className="flex justify-center">
        <img src={logo} alt="Logo Free's Biz" className="h-24" />
      </div>
    </header>
  )
}
