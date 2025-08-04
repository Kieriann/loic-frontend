import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../../assets/logo.png'
import cx from 'classnames'

export default function HomeTopBar({ isConnected }) {
  const location = useLocation()
  const current = location.pathname

  return (
    <div className="flex justify-between items-center max-w-5xl mx-auto px-6 py-4">
      {/* Onglets à gauche */}
        <div className="flex gap-10 text-white font-bold text-2xl items-center">
        <Link
          to="/"
          className={cx(
            'transition border-b-2',
            current === '/' ? 'border-white' : 'border-transparent hover:border-white'
          )}
        >
          Accueil
        </Link>
        <Link
          to="/stats"
          className={cx(
            'transition border-b-2',
            current === '/stats' ? 'border-white' : 'border-transparent hover:border-white'
          )}
        >
          Les chiffres
        </Link>
      </div>

      {/* Logo au centre */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <img
        src={logo}
        alt="Logo Free's Biz"
        className="h-60 border border-white rounded-full shadow-xl bg-white/10 backdrop-blur"
        style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}
        />
      </div>

      {/* À droite : login/signup ou menu connecté */}
      <div className="flex gap-10 text-white font-bold text-2xl items-center">

        {isConnected ? (
          <div className="w-9 h-9 rounded-full border border-white flex items-center justify-center bg-white text-blue-500 text-xl">
            ☰
          </div>
        ) : (
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/signup">Inscription</Link>
          </>
        )}
      </div>
    </div>
  )
}
