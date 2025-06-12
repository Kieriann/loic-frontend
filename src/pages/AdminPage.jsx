//
// ─── Page admin : affichage et recherche des profils enregistrés ──
//

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminPage() {
  const [profils, setProfils] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const fetchProfils = async (query = '') => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:4000/api/admin/profils?search=${query}`, {
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
    <div className="min-h-screen bg-primary px-6 py-10">
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
