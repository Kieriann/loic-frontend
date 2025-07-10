import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import labels from '../labels'
import { useEffect } from 'react'

export default function Home() {
  const [showClientText, setShowClientText] = useState(false)
  const [showFreelanceText, setShowFreelanceText] = useState(false)

  const [cvCount, setCvCount] = useState(0)

useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/api/documents/count-cv`)
    .then(res => res.json())
    .then(data => setCvCount(data.count))
    .catch(() => setCvCount(0))
}, [])


  return (
  <div className="min-h-screen bg-[#94c9df] py-10 flex flex-col items-center w-full">
      {/* Header avec les boutons */}
      <div className="w-full flex justify-center gap-4 mb-10">
        <Link to="/login" className="text-blue-500 bg-white border border-blue-500 px-4 py-2 rounded-full">
          Connexion
        </Link>
        <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded-full">
          Inscription
        </Link>
      </div>

      {/* Corps de la page d'accueil */}
      <div className="w-full max-w-6xl text-center px-4 bg-white rounded-3xl p-10 shadow-md">
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-stretch">
          {/* Bloc client */}
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl font-bold text-gray-800">Vous êtes une entreprise ?</h1>
            <p className="text-gray-600">
              Déposez gratuitement votre besoin. Recevez une shortlist ciblée en 48h, sans commission.
            </p>

            <button
              onClick={() => setShowClientText(!showClientText)}
              className="text-blue-500 mt-2"
            >
              {showClientText ? '▲' : '▼'}
            </button>

            {showClientText && (
              <>
                <p className="text-gray-600 mt-2 whitespace-pre-line">
                  {labels.homeClientLongText}
                </p>
                <Link
                  to="/signup"
                  className="bg-blue-500 text-white px-4 py-2 rounded-full inline-block mt-4"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>



          {/* Bloc freelance */}
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl font-bold text-gray-800">Vous êtes indépendant ?</h1>
            <p className="text-gray-600">
              Rejoignez Freebiz : 0% de commission, aucun engagement, plus de missions.
            </p>

            <button
              onClick={() => setShowFreelanceText(!showFreelanceText)}
              className="text-blue-500 mt-2"
            >
              {showFreelanceText ? '▲' : '▼'}
            </button>

            {showFreelanceText && (
              <>
                <p className="text-gray-600 mt-2 whitespace-pre-line">
                  {labels.homeFreelanceLongText}
                </p>
                <Link
                  to="/signup"
                  className="bg-blue-500 text-white px-4 py-2 rounded-full inline-block mt-4"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
          <p className="mt-6 text-gray-800 font-semibold">
            {cvCount} CV disponibles sur la plateforme
          </p>
      </div>
    </div>
  )
}
