//
// ─── Page admin : affichage et recherche des profils enregistrés ──
//

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL

export default function AdminPage() {
  const [profils, setProfils] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const fetchProfils = async (query = '') => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/admin/profils?search=${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      })

      const data = await res.json()
      if (Array.isArray(data)) {
        setProfils(data)
      } else {
        console.error('Erreur backend admin/profils', data)
        setProfils([])
      }
    } catch (err) {
      console.error('Erreur requête admin profils', err)
      setProfils([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfils()
  }, [])

  const handleSearch = (e) => {
    const val = e.target.value
    setSearch(val)
    fetchProfils(val)
  }

  return (
    <div className="min-h-screen bg-primary px-6 py-10 relative">
      <div className="absolute top-4 right-4 p-10">
        <div
          onClick={() => setOpen(!open)}
          className="w-9 h-9 rounded-full border border-white flex items-center justify-center bg-white text-blue-500 text-xl cursor-pointer"
        >
          ☰
        </div>

        {open && (
          <div className="mt-2 bg-white text-darkBlue shadow-lg rounded p-3 w-40">
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

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-darkBlue text-center">Profils enregistrés</h1>

        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Rechercher par nom, prénom, mot-clé..."
          className="w-full p-3 border border-primary rounded text-darkBlue"
        />

        {loading ? (
          <p className="text-center text-darkBlue">Chargement...</p>
        ) : (
          <div className="space-y-4">
            {profils.length === 0 && (
              <p className="text-center text-gray-500">Aucun profil trouvé</p>
            )}
            {profils.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/admin/profil/${p.id}`)}
                className="cursor-pointer border border-primary rounded p-4 bg-[#f8fbff] hover:bg-[#e6f2ff] transition"
              >
                <p><strong>Nom :</strong> {p.firstname} {p.lastname}</p>
                <p><strong>Téléphone :</strong> {p.phone}</p>
                <p><strong>Email :</strong> {p.User?.email}</p>
                <p><strong>Bio :</strong> {p.bio}</p>
                <p><strong>SIRET :</strong> {p.siret}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
