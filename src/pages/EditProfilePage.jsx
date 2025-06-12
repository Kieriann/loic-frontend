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
    availableDate: '',
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
  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetchProfile(token)

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
          }])
        }
      } catch (err) {
        console.error('Erreur chargement profil', err)
      }
    }

    loadData()
  }, [])

  const validate = () => {
    const newErrors = {}
    if (!profile.firstname.trim()) newErrors.firstname = 'Champ obligatoire'
    if (!profile.lastname.trim()) newErrors.lastname = 'Champ obligatoire'
    if (!profile.siret.trim()) newErrors.siret = 'Champ obligatoire'
    if (!profile.bio.trim()) newErrors.bio = 'Champ obligatoire'
    if (!profile.smallDayRate) newErrors.smallDayRate = 'Champ obligatoire'
    if (!address.address.trim()) newErrors.address = 'Champ obligatoire'
    if (!address.city.trim()) newErrors.city = 'Champ obligatoire'
    if (!address.postalCode.trim()) newErrors.postalCode = 'Champ obligatoire'
    if (!address.country.trim()) newErrors.country = 'Champ obligatoire'
    if (!langList.length) newErrors.languages = 'Champ obligatoire'
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      const firstKey = Object.keys(newErrors)[0]
      const el = document.querySelector(`[name="${firstKey}"]`)
      if (el?.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return false
    }
    return true
  }

  const addLanguage = () => {
    if (!langInput.trim()) return
    setLangList([...langList, `${langInput.trim()}:${levelInput}`])
    setLangInput('')
    setLevelInput('débutant')
  }

  const updateExperience = (index, field, value) => {
    const updated = [...experiences]
    updated[index][field] = value
    setExperiences(updated)
  }

  const addExperienceLanguage = (index) => {
    const updated = [...experiences]
    updated[index].languages.push(`${updated[index].newLangInput}:${updated[index].newLangLevel}`)
    updated[index].newLangInput = ''
    updated[index].newLangLevel = 'junior'
    setExperiences(updated)
  }

  const removeExperienceLanguage = (expIndex, langIndex) => {
    const updated = [...experiences]
    updated[expIndex].languages.splice(langIndex, 1)
    setExperiences(updated)
  }

  const addExperience = () => {
    setExperiences([...experiences, {
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

  const confirmDelete = () => {
    const copy = [...experiences]
    copy.splice(popup.index, 1)
    setExperiences(copy)
    setPopup({ open: false, index: null, type: '' })
  }

  const handleSubmit = async () => {
    if (!validate()) return

    const formData = new FormData()
    const formattedExperiences = experiences.map(exp => ({
      ...exp,
      realFilePath: exp.realFile ? `real_${exp.realFile.name}` : exp.realFilePath || '',
    }))

    experiences.forEach((exp, i) => {
      if (exp.realFile) {
        formData.append('realFiles', exp.realFile, `real_${i}_${exp.realFile.name}`)
      }
    })

    formData.append('profile', JSON.stringify({ ...profile, languages: langList.join(',') }))
    formData.append('address', JSON.stringify(address))
    formData.append('experiences', JSON.stringify(formattedExperiences))
    if (documents.photo) formData.append('photo', documents.photo)
    if (documents.cv) formData.append('cv', documents.cv)

    try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/profil`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
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
        {popup.open && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl text-center space-y-4 max-w-sm">
              <p className="text-lg">Voulez-vous supprimer cette {popup.type} ?</p>
              <div className="flex justify-center gap-4">
                <button onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded">Oui</button>
                <button onClick={() => setPopup({ open: false, index: null, type: '' })} className="border px-4 py-2 rounded">Non</button>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-2xl text-darkBlue font-bold text-center">Modifier mon profil</h1>
        <div className="flex gap-3 justify-center">
          {['profil', 'expériences', 'realisations'].map(tab => (
            <button key={tab} onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-xl font-semibold ${selectedTab === tab ? 'bg-blue-100 text-darkBlue' : 'hover:bg-blue-50'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {selectedTab === 'profil' && (
          <>
            <ProfileInfo data={profile} setData={setProfile} errors={errors} />
            <AddressInfo data={address} setData={setAddress} errors={errors} />
            <div className="space-y-2">
              <label className="text-xl font-semibold text-darkBlue">Langues</label>
              <div className="flex gap-2">
                <input type="text" value={langInput} onChange={(e) => setLangInput(e.target.value)} placeholder="Langue (ex: français)" className="border rounded px-2 py-1 flex-1" />
                <select value={levelInput} onChange={(e) => setLevelInput(e.target.value)} className="border rounded px-2 py-1">
                  <option value="débutant">Débutant</option>
                  <option value="intermédiaire">Intermédiaire</option>
                  <option value="courant">Courant</option>
                </select>
                <button type="button" onClick={addLanguage} className="bg-darkBlue text-white px-3 py-1 rounded">Ajouter</button>
              </div>
              <ul className="text-sm text-gray-700 space-y-1">
                {langList.map((l, i) => {
                  const [name, level] = l.split(':')
                  return (
                    <li key={i} className="flex gap-2 items-center">
                      <span>{name} : {level}</span>
                      <button type="button" onClick={() => setLangList(langList.filter((_, index) => index !== i))} className="text-red-500 text-xs hover:underline">Supprimer</button>
                    </li>
                  )
                })}
              </ul>
              {errors.languages && <p className="text-red-500 text-sm">{errors.languages}</p>}
            </div>
            <DocumentUpload data={documents} setData={setDocuments} />
          </>
        )}

        {selectedTab === 'expériences' && (
          <>
            <div className="flex items-center gap-6 mb-4">
              <label className="inline-flex items-center gap-2 font-semibold text-darkBlue">
                <input type="checkbox" checked={profile.isEmployed} onChange={(e) => setProfile({ ...profile, isEmployed: e.target.checked })} />
                Actuellement en poste
              </label>
              {profile.isEmployed && (
                <>
                  <label className="font-semibold text-darkBlue ml-12">Disponible à partir du</label>
                  <input type="date" value={profile.availableDate} onChange={(e) => setProfile({ ...profile, availableDate: e.target.value })} className="border rounded px-2 py-1" />
                </>
              )}
            </div>

            {experiences.map((exp, i) => (
              <div key={i} className="border rounded p-4 space-y-3">
                <input type="text" placeholder="Titre de l'expérience (Projet: vie sur Mars)" value={exp.title} onChange={e => updateExperience(i, 'title', e.target.value)} className="border rounded px-3 py-2 w-full" />
                <input type="text" placeholder="Client" value={exp.client || ''} onChange={e => updateExperience(i, 'client', e.target.value)} className="border rounded px-3 py-2 w-full" />
                <input type="text" placeholder="Domaines" value={exp.domains} onChange={e => updateExperience(i, 'domains', e.target.value)} className="border rounded px-3 py-2 w-full" />
                <textarea placeholder="Description" value={exp.description} onChange={e => updateExperience(i, 'description', e.target.value)} className="border rounded px-3 py-2 w-full min-h-[120px]" />

                <div className="flex gap-2">
                  <input type="text" placeholder="Langages et logiciels" value={exp.newLangInput} onChange={e => updateExperience(i, 'newLangInput', e.target.value)} className="border rounded px-2 py-1 flex-1" />
                  <select value={exp.newLangLevel} onChange={e => updateExperience(i, 'newLangLevel', e.target.value)} className="border rounded px-2 py-1">
                    <option value="junior">Junior</option>
                    <option value="intermédiaire">Intermédiaire</option>
                    <option value="senior">Senior</option>
                  </select>
                  <button onClick={() => addExperienceLanguage(i)} className="bg-darkBlue text-white px-3 py-1 rounded">Ajouter</button>
                </div>

                <ul className="text-sm text-gray-700 space-y-1">
                  {Array.isArray(exp.languages) && exp.languages.map((l, j) => {
                    const [name, level] = l.split(':')
                    return (
                      <li key={j} className="flex gap-2 items-center">
                        <span>{name} : {level}</span>
                        <button type="button" onClick={() => removeExperienceLanguage(i, j)} className="text-red-500 text-xs hover:underline">Supprimer</button>
                      </li>
                    )
                  })}
                </ul>

                <button onClick={() => setPopup({ open: true, index: i, type: 'expérience' })} className="text-red-600 underline text-sm">Supprimer cette expérience</button>
              </div>
            ))}

            <div className="text-center mt-4">
              <button type="button" onClick={addExperience} className="text-darkBlue border border-darkBlue px-4 py-2 rounded hover:bg-darkBlue hover:text-white transition">Ajouter une expérience</button>
            </div>
          </>
        )}

        {selectedTab === 'realisations' && (
          <>
            {experiences.map((real, i) => (
              <div key={i} className="border rounded p-4 space-y-3">
                <input type="text" placeholder="Titre de la réalisation" value={real.realTitle} onChange={(e) => updateExperience(i, 'realTitle', e.target.value)} className="border rounded px-3 py-2 w-full" />
                <textarea placeholder="Description" value={real.realDescription} onChange={(e) => updateExperience(i, 'realDescription', e.target.value)} className="border rounded px-3 py-2 w-full min-h-[100px]" />
                <>
                  <input type="file" className="hidden" id={`real-doc-${i}`} onChange={(e) => updateExperience(i, 'realFile', e.target.files[0])} />
                  <button type="button" className="text-darkBlue underline text-sm" onClick={() => document.getElementById(`real-doc-${i}`).click()}>
                    Ajouter un document
                  </button>
                  {real.realFile
                    ? <p className="text-sm text-gray-600 italic">{real.realFile.name}</p>
                    : real.realFilePath && <p className="text-sm text-gray-600 italic">{real.realFilePath}</p>}
                </>
                <button onClick={() => setPopup({ open: true, index: i, type: 'réalisation' })} className="text-red-600 underline text-sm ml-12">Supprimer cette réalisation</button>
              </div>
            ))}

            <div className="text-center mt-4">
              <button type="button" onClick={addExperience} className="text-darkBlue border border-darkBlue px-4 py-2 rounded hover:bg-darkBlue hover:text-white transition">Ajouter une réalisation</button>
            </div>
          </>
        )}

        <div className="text-center">
          <button onClick={handleSubmit} className="bg-darkBlue text-white px-6 py-3 rounded-xl hover:bg-[#001a5c] transition">Enregistrer le profil</button>
        </div>
      </div>
    </div>
  )
}

