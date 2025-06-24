//
// ─── Page : affichage du profil utilisateur connecté ──────────────
//

import React, { useEffect, useState } from 'react'
import { fetchProfile } from '../api/fetchProfile'
import { Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'


export default function ProfilePage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
const initialTab = searchParams.get('tab')
const [selectedTab, setSelectedTab] = useState(initialTab || 'profil')
  const [documents, setDocuments] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetchProfile(token)
        setData(res)
        console.log('profil récupéré', res)
      } catch (err) {
        console.error('Erreur chargement', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

useEffect(() => {
  const fetchDocs = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/documents/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const docs = Array.isArray(res.data) ? res.data : Object.values(res.data || {})
      console.log('documents', docs)
      setDocuments(docs)
    } catch (err) {
      console.error('Erreur chargement documents', err)
    }
  }
  fetchDocs()
}, [])




  if (loading) return <p className="p-4">Chargement...</p>
  if (!data?.profile || !data.profile.firstname) return <Navigate to="/profile/edit" replace />

  const { profile, experiences, prestations, realisations } = data
  const address = profile.Address || {}
  console.log('realFilePaths filtrés :', experiences.filter(e => e.realFilePath).map(e => e.realFilePath))

console.log('realisations récupérées :', realisations)
console.log('Fichiers de la première réalisation :', realisations[0]?.files)


  return (
    <div className="min-h-screen bg-primary flex justify-center px-4 py-10">
      <div className="w-full max-w-6xl flex gap-6 items-stretch">

        {/* Onglets */}
        <div className="w-48 bg-white rounded-2xl shadow-md p-6 h-full">
          <div className="flex flex-col gap-3">
            {['profil', 'competences', 'realisations', 'prestations'].map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`w-full rounded-xl px-4 py-2 font-semibold text-left ${
                  selectedTab === tab ? 'bg-blue-100 text-darkBlue' : 'hover:bg-blue-50'
                }`}
              >
                {tab === 'competences' ? 'Experiences' : tab.charAt(0).toUpperCase() + tab.slice(1)}
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
                {selectedTab === 'competences' && 'Mes Experiences'}
                {selectedTab === 'realisations' && 'Mes Réalisations'}
                {selectedTab === 'prestations' && 'Mes Prestations'}
              </h1>
              <button
              onClick={() => navigate(`/profile/edit?tab=${selectedTab}`)}
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
                  <Line label="Courte durée">{profile.smallDayRate} €</Line>
                  <Line label="Moyenne durée">{profile.mediumDayRate} €</Line>
                  <Line label="Longue durée">{profile.highDayRate} €</Line>
                </Section>
              </div>

              <div className="text-center">
                <Section title="Télétravail">
                  <p>
                    Je souhaite télétravailler{' '}
                    <strong>{profile.teleworkDays}</strong>{' '}
                    jour{profile.teleworkDays > 1 ? 's' : ''} sur 5 jours travaillés.
                  </p>
                </Section>
              </div>

              <Section title="Langues">
                <ul className="text-base text-gray-800 pl-5 max-w-xl mx-auto text-center">
                  {(profile.languages || '').split(',').map((l, i) => {
                    const [name, levels] = l.split(':')
                    const [written, oral] = (levels || '').split('/')
                    return (
                      <li key={i}>
                        {name} — écrit : {written || '–'}, oral : {oral || '–'}
                      </li>
                    )
                  })}
                </ul>
              </Section>

<Section title="Documents">
  <ul className="list-disc list-inside text-left max-w-xl mx-auto">
    {documents.length === 0 && (
      <li className="text-gray-500 italic">Aucun document</li>
    )}
{Array.isArray(documents) && documents.map((doc, index) => {
  if (!doc || typeof doc !== 'object' || !doc.fileName || !doc.type) return null

  const typeLabel = doc.type === 'CV' ? 'CV' : 'Photo'
  const name = doc.fileName
  const link = doc.fileName

  return (
    <li key={doc.id || index}>
      <strong>{typeLabel} :</strong>{' '}
<a
  href={doc.type === 'CV'
    ? `https://docs.google.com/viewer?url=https://res.cloudinary.com/dwwt3sgbw/raw/upload/${doc.fileName}&embedded=true`
    : `https://res.cloudinary.com/dwwt3sgbw/image/upload/${doc.fileName}`
  }
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-600 underline"
>
  {name}
</a>


    </li>
  )
})}



  </ul>
</Section>



            </>
          )}

          {/* EXPERIENCES */}
          {selectedTab === 'competences' && (
            <Section title="Experiences">
              <div className="text-center mb-6">
                {profile.isEmployed ? (
                  <p className="text-red-600 font-semibold">
                    Je serai disponible à partir du :{' '}
                    {profile.availableDate ? (
                      <strong>
                        {new Date(profile.availableDate).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </strong>
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
                <div
                  key={i}
                  className="border border-primary rounded p-4 space-y-2 w-full max-w-xl bg-[#f8fbff]"
                >
                  <p><strong>Titre :</strong> {exp.title}</p>
                  <p><strong>Client :</strong> {exp.client}</p>
                  <p><strong>Description :</strong> {exp.description}</p>
                  <p><strong>Domaines :</strong> {exp.domains}</p>
                  <p>
                    <strong>Langages :</strong>{' '}
                    {Array.isArray(exp.languages)
                      ? exp.languages.map((l, j) => {
                          const [name, level] = l.split(':')
                          return <span key={j}>{name} ({level}){j < exp.languages.length - 1 ? ', ' : ''}</span>
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
      {realisations && realisations.length > 0 ? (
        realisations.map((r, i) => (
          <div key={i} className="border rounded p-4 bg-[#f8fbff] space-y-2">
            <p><strong>Titre :</strong> {r.title || 'Sans titre'}</p>
<p><strong>Description :</strong> {r.description || 'Aucune description'}</p>
{r.files && r.files.length > 0 && (
  <div className="space-y-1">
    <strong>Documents :</strong>
    {r.files.map((f, idx) => (
      <div key={idx}>
        <a
href={`https://res.cloudinary.com/dwwt3sgbw/raw/upload/${f.fileName}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {f.originalName}
        </a>
      </div>
    ))}
  </div>
)}




          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">Aucune réalisation renseignée</p>
      )}
    </div>
  </Section>
)}


          {/* PRESTATIONS */}
          {selectedTab === 'prestations' && (
            <Section title="Prestations">
              {prestations && prestations.length > 0 ? (
                prestations.map((p, i) => (
                  <p key={i} className="mb-2">
                    Je suis capable d&apos;assurer <strong>{p.type}</strong> pour <strong>{p.tech}</strong> à un niveau <strong>{p.level}</strong>.
                  </p>
                ))
              ) : (
                <p className="text-gray-500 italic">Aucune prestation renseignée</p>
              )}
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
