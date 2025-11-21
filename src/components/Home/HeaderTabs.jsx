import { useLocation, Link } from 'react-router-dom'
import cx from 'classnames'
import React from 'react'

export default function HeaderTabs() {
  const location = useLocation()
const current = location.pathname
const [open, setOpen] = React.useState(false)
const isAdminPage = current.startsWith('/admin')
const hasToken = !!localStorage.getItem('token')
  

return (
  <div className="fixed top-0 left-0 w-full z-50 bg-transparent px-6 py-4">
    <div className="flex justify-between items-center text-sm font-semibold text-white">
      <div className="flex gap-6">
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

      {isAdminPage && hasToken && (
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="w-9 h-9 rounded-full border border-white flex items-center justify-center bg-white text-blue-500 text-xl cursor-pointer"
          >
            ☰
          </div>

          {open && (
            <div className="absolute right-0 mt-2 bg-white text-darkBlue shadow-lg rounded p-3 w-40">
              <button
                className="w-full text-left hover:bg-gray-100 p-2 rounded"
                onClick={() => {
                  localStorage.removeItem('token')
                  window.location.href = '/'
                }}
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
)
}
