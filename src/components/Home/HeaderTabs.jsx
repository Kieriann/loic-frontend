import { useLocation, Link } from 'react-router-dom'
import cx from 'classnames'
import React from 'react'

export default function HeaderTabs() {
  const location = useLocation()
  const current = location.pathname

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-transparent px-6 py-4">
      <div className="flex gap-6 text-sm font-semibold text-white">
        <Link
          to="/"
          className={cx(
            'transition duration-150 border-b-2',
            current === '/' ? 'border-white' : 'border-transparent hover:border-white'
          )}
        >
          Accueil
        </Link>
        <Link
          to="/stats"
          className={cx(
            'transition duration-150 border-b-2',
            current === '/stats' ? 'border-white' : 'border-transparent hover:border-white'
          )}
        >
          Les chiffres
        </Link>
      </div>
    </div>
  )
}
