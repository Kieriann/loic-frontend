//
// ─── Page admin : vue détaillée d’un profil individuel ────────────
//

import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL

export default function AdminProfilDetail() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/profil/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        })
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error('Erreur chargement profil admin', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfil()
  }, [id])

  if (loading) return <p className="p-4">Chargement...</p>
  if (!data?.profile) return <p className="p-4 text-red-500">Profil introuvable</p>

  const { profile, experiences, documents } = data
  const address = profile.Address || {}

  return (
    <div className="min-h-screen bg-primary px-6 py-10">
      <button
        onClick={() => navigate('/admin')}
        className="text-sm text-darkBlue underline hover:text-blue-800 mb-4"
      >
        ← Retour à la liste
      </button>

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-darkBlue text-center">
          {profile.firstname} {profile.lastname}
        </h1>

        <p className="text-center text-sm text-gray-500">{profile.User?.email}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Info title="Téléphone" content={profile.phone} />
          <Info title="SIRET" content={profile.siret} />
          <Info title="Langues" content={profile.languages} />
          <Info title="En poste" content={profile.isEmployed ? 'Oui' : 'Non'} />
          <Info title="Bio" content={profile.bio} className="md:col-span-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Info title="Adresse" content={address.address} />
          <Info title="Ville" content={address.city} />
          <Info title="Code postal" content={address.postalCode} />
          <Info title="Région" content={address.state} />
          <Info title="Pays" content={address.country} />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-darkBlue mb-2">Expériences</h2>
          {experiences.length === 0 && <p className="text-gray-500">Aucune expérience</p>}
          {experiences.map((exp, i) => (
            <div key={i} className="bg-[#f8fbff] border border-primary rounded p-4 mb-4">
              <p><strong>Titre :</strong> {exp.title}</p>
              <p><strong>Description :</strong> {exp.description}</p>
              <p><strong>Expériences :</strong> {exp.skills}</p>
              <p><strong>Langues :</strong> {exp.languages}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-darkBlue mb-2">Documents</h2>
          {documents.length === 0 && <p className="text-gray-500">Aucun document</p>}
          {documents.map((doc, i) => (
            <p key={i} className="text-sm">{doc.type}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

function Info({ title, content, className = '' }) {
  return (
    <div className={`bg-[#f8fbff] p-3 rounded border border-primary ${className}`}>
      <p className="text-sm text-darkBlue font-semibold">{title}</p>
      <p>{content || <span className="italic text-gray-500">Non renseigné</span>}</p>
    </div>
  )
}
