import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Header({ onLogout }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    onLogout(null)
    navigate('/')
  }

  return (
    <header className="bg-primary py-4 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <img
          src={logo}
          alt="Logo Free's Biz"
          className="h-16 cursor-pointer"
          onClick={() => navigate('/')}
        />
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="text-white text-3xl font-bold focus:outline-none"
        >
          ☰
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-darkBlue rounded shadow-lg z-50">
            <button
              onClick={() => navigate('/profile')}
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              Mon profil
            </button>
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
