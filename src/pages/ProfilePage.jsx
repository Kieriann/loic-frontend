//
// ─── Page : affichage du profil utilisateur connecté ──────────────
//

import React, { useEffect, useState } from 'react'
import { fetchProfile } from '../api/fetchProfile'
import { Navigate, useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('profil')
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetchProfile(token)
        setData(res)
      } catch (err) {
        console.error('Erreur chargement', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <p className="p-4">Chargement...</p>
  if (!data?.profile || !data.profile.firstname) return <Navigate to="/profile/edit" replace />

  const { profile, experiences } = data
  const address = profile.Address || {}

  return (
    <div className="min-h-screen bg-primary flex justify-center px-4 py-10">
      <div className="w-full max-w-6xl flex gap-6 items-stretch">

        {/* Onglets */}
        <div className="w-48 bg-white rounded-2xl shadow-md p-6 h-full">
          <div className="flex flex-col gap-3">
            {['profil', 'competences', 'realisations'].map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`w-full rounded-xl px-4 py-2 font-semibold text-left ${
                  selectedTab === tab ? 'bg-blue-100 text-darkBlue' : 'hover:bg-blue-50'
                }`}
              >
                {tab === 'competences' ? 'Expériences' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 bg-white rounded-2xl shadow-md p-6 space-y-10">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl text-darkBlue font-bold">
                {selectedTab === 'profil' && 'Mon Profil'}
                {selectedTab === 'competences' && 'Mes Expériences'}
                {selectedTab === 'realisations' && 'Mes Réalisations'}
              </h1>
              <button
                onClick={() => navigate('/profile/edit')}
                className="text-sm text-darkBlue border border-darkBlue px-4 py-2 rounded hover:bg-darkBlue hover:text-white transition"
              >
                Modifier
              </button>
            </div>
          </div>

          {/* PROFIL */}
          {selectedTab === 'profil' && (
            <>
              <p className="text-center text-2xl italic font-semibold text-darkBlue">
                {profile.firstname} {profile.lastname}
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Section title="Informations">
                  <Line label="Téléphone">{profile.phone}</Line>
                  <Line label="SIRET">{profile.siret}</Line>
                  <Line label="En poste">{profile.isEmployed ? 'Oui' : 'Non'}</Line>
                  <Line label="Bio">{profile.bio}</Line>
                </Section>

                <Section title="Adresse" borderLeft>
                  <Line label="Adresse">{address.address}</Line>
                  <Line label="Code postal">{address.postalCode}</Line>
                  <Line label="Ville">{address.city}</Line>
                  <Line label="Pays">{address.country}</Line>
                </Section>
              </div>

              <div className="text-center">
                <Section title="Tarifs journaliers">
                  <Line label="Petit projet">{profile.smallDayRate} €</Line>
                  <Line label="Moyen projet">{profile.mediumDayRate} €</Line>
                  <Line label="Gros projet">{profile.highDayRate} €</Line>
                </Section>
              </div>

              <Section title="Langues">
                <ul className="text-base text-gray-800 pl-5 max-w-xl mx-auto text-center">
                  {(profile.languages || '').split(',').map((l, i) => {
                    const [name, level] = l.split(':')
                    return <li key={i}>{name} : {level}</li>
                  })}
                </ul>
              </Section>
            </>
          )}

          {/* EXPÉRIENCES */}
          {selectedTab === 'competences' && (
            <Section title="Expériences">
              <div className="text-center mb-6">
                {profile.isEmployed ? (
                  <p className="text-red-600 font-semibold">
                    Je serai disponible à partir du :{' '}
                    {profile.availableDate ? (
                      <strong>{profile.availableDate}</strong>
                    ) : (
                      <em className="text-gray-500">non précisée</em>
                    )}
                  </p>
                ) : (
                  <p className="text-green-600 font-semibold">
                    Je suis actuellement disponible
                  </p>
                )}
              </div>

              {experiences.length === 0 && (
                <p className="text-gray-500">Aucune expérience renseignée</p>
              )}
              {experiences.map((exp, i) => (
                <div key={i} className="border border-primary rounded p-4 space-y-2 w-full max-w-xl bg-[#f8fbff]">
                  <p><strong>Titre :</strong> {exp.title}</p>
                  <p><strong>Client :</strong> {exp.client}</p>
                  <p><strong>Description :</strong> {exp.description}</p>
                  <p><strong>Domaines :</strong> {exp.domains}</p>
                  <p>
                    <strong>Langages :</strong>{' '}
                    {Array.isArray(exp.languages)
                      ? exp.languages.map((l, i) => {
                          const [name, level] = l.split(':')
                          return <span key={i}>{name} ({level}){i < exp.languages.length - 1 ? ', ' : ''}</span>
                        })
                      : 'Aucun'}
                  </p>
                </div>
              ))}
            </Section>
          )}

          {/* RÉALISATIONS */}
          {selectedTab === 'realisations' && (
            <Section title="Réalisations">
              <div className="space-y-4 w-full max-w-xl">
                {experiences
                  .filter(r => r.realTitle?.trim() || r.realDescription?.trim())
                  .map((r, i) => (
                    <div key={i} className="border rounded p-4 bg-[#f8fbff] space-y-2">
                      {r.realTitle && <p><strong>Titre :</strong> {r.realTitle}</p>}
                      {r.realDescription && <p><strong>Description :</strong> {r.realDescription}</p>}
                      {r.realFilePath && (
                        <p>
                          <strong>Document :</strong>{' '}
                          <a
                            href={`${import.meta.env.VITE_API_URL}/uploads/${r.realFilePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            Voir le fichier
                          </a>
                        </p>
                      )}
                    </div>
                  ))}

                {experiences.filter(r => r.realTitle?.trim() || r.realDescription?.trim()).length === 0 && (
                  <p className="text-gray-500 italic">Aucune réalisation renseignée</p>
                )}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  )
}

function Section({ title, children, borderLeft = false, className = '' }) {
  return (
    <div className={`space-y-6 ${borderLeft ? 'lg:pl-8 lg:border-l border-primary' : ''} ${className}`}>
      <div className="bg-[#f8fbff] p-6 rounded-xl shadow-sm w-full">
        <h2 className="text-xl font-bold text-darkBlue text-center mb-8">{title}</h2>
        {children}
      </div>
    </div>
  )
}

function Line({ label, children }) {
  return (
    <p>
      <strong className="text-darkBlue">{label} :</strong>{' '}
      {children || <span className="text-gray-500 italic">Non renseigné</span>}
    </p>
  )
}
