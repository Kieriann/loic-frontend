import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function RoleButtons() {
  const navigate = useNavigate()

  return (
    <div className="mt-10 rounded-3xl px-6 py-4 flex flex-col sm:flex-row justify-center gap-20 w-fit mx-auto">
      <button
        onClick={() => navigate('/entreprise')}
        className="bg-white text-black-600 font-bold text-xl px-6 py-3 rounded-full shadow-md hover:bg-blue-100 transition"
      >
        Vous êtes une entreprise
      </button>
      <button
        onClick={() => navigate('/indep')}
        className="bg-white text-black-600 font-bold text-xl px-6 py-3 rounded-full shadow-md hover:bg-blue-100 transition"
      >
        Vous êtes indépendant
      </button>
    </div>
  )
}
