//
// ─── Page : modification complète du profil utilisateur ───────────
//

import React, { useState, useEffect } from 'react'
import ProfileInfo from '../components/sections/ProfileInfo'
import AddressInfo from '../components/sections/AddressInfo'
import DocumentUpload from '../components/sections/DocumentUpload'
import { fetchProfile } from '../api/fetchProfile'
import { useNavigate } from 'react-router-dom'

export default function EditProfilePage() {
  const [profile, setProfile] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    siret: '',
    bio: '',
    smallDayRate: 0,
    mediumDayRate: 0,
    highDayRate: 0,
    languages: '',
    isEmployed: false,
    availableDate: null,
  })

  const [langInput, setLangInput] = useState('')
  const [levelInput, setLevelInput] = useState('débutant')
  const [langList, setLangList] = useState([])
  const [selectedTab, setSelectedTab] = useState('profil')
  const [address, setAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    state: '',
    country: '',
  })
  const [experiences, setExperiences] = useState([])
  const [documents, setDocuments] = useState({ photo: null, cv: null })
  const [errors, setErrors] = useState({})
  const [popup, setPopup] = useState({ open: false, index: null, type: '' })
  const [prestations, setPrestations] = useState([{
    type: '',
    tech: '',
    level: 'junior',
  }])

  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetchProfile(token)

        // ─── Profil de base ─────────────────────────
        if (res.profile) {
          const {
            firstname, lastname, phone, siret, bio,
            smallDayRate, mediumDayRate, highDayRate,
            languages, isEmployed, availableDate
          } = res.profile

          setProfile({
            firstname,
            lastname,
            phone,
            siret,
            bio,
            smallDayRate,
            mediumDayRate,
            highDayRate,
            languages,
            isEmployed,
            availableDate: availableDate || '',
          })

          setLangList((languages || '').split(','))

          if (res.profile.Address) {
            const { address, city, postalCode, state, country } = res.profile.Address
            setAddress({ address, city, postalCode, state, country })
          }
        }

        // ─── Expériences ────────────────────────────
        if (res.experiences?.length) {
          setExperiences(res.experiences.map(exp => ({
            title: exp.title,
            client: exp.client || '',
            description: exp.description,
            domains: exp.domains,
            languages: Array.isArray(exp.languages) ? exp.languages : [],
            newLangInput: '',
            newLangLevel: 'junior',
            realTitle: exp.realTitle || '',
            realDescription: exp.realDescription || '',
            realFile: null,
            realFilePath: exp.realFilePath || '',
          })))
        } else {
          setExperiences([{
            title: '',
            client: '',
            description: '',
            domains: '',
            languages: [],
            newLangInput: '',
            newLangLevel: 'junior',
            realTitle: '',
            realDescription: '',
            realFile: null,
            realFilePath: '',
          }])
        }

        // ─── Prestations ────────────────────────────
        if (res.prestations?.length) {
          setPrestations(res.prestations.map(p => ({
            type: p.type || '',
            tech: p.tech || '',
            level: p.level || '',
          })))
        } else {
          setPrestations([{
            type: '',
            tech: '',
            level: 'junior',
          }])
        }
      } catch (err) {
        console.error('Erreur chargement profil', err)
      }
    }

    loadData()
  }, [])

  // … validate, addLanguage, updateExperience, etc. restent inchangés …

  const handleSubmit = async () => {
    if (!validate()) return

    const formData = new FormData()
    // … préparation des experiences …

    formData.append('profile', JSON.stringify({ ...profile, languages: langList.join(',') }))
    formData.append('address', JSON.stringify(address))
    formData.append('experiences', JSON.stringify(experiences))
    formData.append('prestations', JSON.stringify(prestations))
    if (documents.photo) formData.append('photo', documents.photo)
    if (documents.cv)    formData.append('cv', documents.cv)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/profil`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      })
      if (!res.ok) throw new Error('Échec de l’enregistrement')
      navigate('/profile')
    } catch (err) {
      console.error(err)
      alert("Erreur lors de l'enregistrement")
    }
  }

  return (
    <div className="min-h-screen bg-primary flex justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-6 space-y-10 relative">
        {/* … l’UI de navigation par onglets … */}

        {selectedTab === 'prestations' && (
          <>
            {prestations.map((p, i) => (
              <div key={i} className="border rounded p-4 space-y-3">
                <p className="font-medium text-darkBlue">Je suis capable d&apos;assurer</p>

                <select
                  value={p.type}
                  onChange={e => {
                    const copy = [...prestations]
                    copy[i].type = e.target.value
                    setPrestations(copy)
                  }}
                  className="border rounded px-2 py-1 w-full"
                >
                  <option value="">-- Choisir --</option>
                  <option value="formation">la formation</option>
                  <option value="coaching">le coaching</option>
                  <option value="maintenance">la maintenance</option>
                  <option value="développement">le développement</option>
                </select>

                <p className="font-medium text-darkBlue">pour</p>
                <input
                  type="text"
                  placeholder="Ex: React, Java"
                  value={p.tech}
                  onChange={e => {
                    const copy = [...prestations]
                    copy[i].tech = e.target.value
                    setPrestations(copy)
                  }}
                  className="border rounded px-2 py-1 w-full"
                />

                <p className="font-medium text-darkBlue">à un niveau</p>
                <select
                  value={p.level}
                  onChange={e => {
                    const copy = [...prestations]
                    copy[i].level = e.target.value
                    setPrestations(copy)
                  }}
                  className="border rounded px-2 py-1 w-full"
                >
                  <option value="junior">junior</option>
                  <option value="intermédiaire">intermédiaire</option>
                  <option value="expert">expert</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    const copy = [...prestations]
                    copy.splice(i, 1)
                    setPrestations(copy)
                  }}
                  disabled={prestations.length <= 1}
                  className="text-red-600 underline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Supprimer cette prestation
                </button>
              </div>
            ))}

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setPrestations([...prestations, { type: '', tech: '', level: 'junior' }])}
                className="text-darkBlue border border-darkBlue px-4 py-2 rounded hover:bg-darkBlue hover:text-white transition"
              >
                Ajouter une prestation
              </button>
            </div>
          </>
        )}

        {/* … bouton Enregistrer … */}
      </div>
    </div>
  )
}
