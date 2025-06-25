import React, { useState, useEffect } from 'react'
import ProfileInfo from '../components/sections/ProfileInfo'
import AddressInfo from '../components/sections/AddressInfo'
import DocumentUpload from '../components/sections/DocumentUpload'
import { fetchProfile } from '../api/fetchProfile'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Real from '../components/Real'

export default function EditProfilePage() {
  const [profile, setProfile] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    siret: '',
    bio: '',
    smallDayRate: '',
    mediumDayRate: '',
    highDayRate: '',
    languages: '',
    isEmployed: false,
    availableDate: null,
    teleworkDays: 0,
  })

  const [langInput, setLangInput] = useState('')
  const [writtenInput, setWrittenInput] = useState('débutant')
  const [oralInput, setOralInput] = useState('débutant')
  const [langList, setLangList] = useState([])
  const [address, setAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    state: '',
    country: '',
  })
  const [experiences, setExperiences] = useState([])
  const [realisations, setRealisations] = useState([])
  const [documents, setDocuments] = useState({ photo: null, cv: null, realisationDocument: null })
  const [errors, setErrors] = useState({})
  const [popup, setPopup] = useState({ open: false, index: null, type: '' })
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab')
  const [prestations, setPrestations] = useState([{
    type: '',
    tech: '',
    level: 'junior',
  }])
  const [selectedTab, setSelectedTab] = useState(initialTab || 'profil')

  useEffect(() => {
    if (initialTab) {
      setSelectedTab(initialTab)
    }
  }, [initialTab])

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetchProfile(token)

        const docArray = Array.isArray(res.documents) ? res.documents : Object.values(res.documents || {})
        const photoDoc = docArray.find(d => d.type === 'ID_PHOTO')
        const cvDoc = docArray.find(d => d.type && d.type.toLowerCase() === 'cv')
        setDocuments({
          photo: photoDoc || null,
          cv: cvDoc ? { fileName: cvDoc.originalName || 'CV' } : null,
        })

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
            realTech: Array.isArray(exp.realTech) ? exp.realTech : [],
            newRealTechInput: '',
            newRealTechLevel: 'junior',
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
            realTech: [],
            newRealTechInput: '',
            newRealTechLevel: 'junior',
          }])
        }

        const realList = res.realisations || []
        setRealisations(realList.length ? realList.map(real => ({
          id: real.id || '',
          realTitle: real.title || '',
          realDescription: real.description || '',
          realTech: Array.isArray(real.techs) ? real.techs : [],
          newRealTechInput: '',
          newRealTechLevel: 'junior',
          realFiles: (real.files || []).map(f => {
            const format = f.format ? `.${f.format}` : '';
            return {
              id: f.id,
              url: `https://res.cloudinary.com/dwwt3sgbw/raw/upload/v${f.version || ''}/${encodeURIComponent(f.publicId)}${format}`,
              name: f.originalName || 'Fichier',
              source: 'cloud',
              version: f.version,
              publicId: f.publicId,
              format: f.format
            }
          })
        })) : [{
          realTitle: '',
          realDescription: '',
          realTech: [],
          newRealTechInput: '',
          newRealTechLevel: 'junior',
          realFiles: [],
        }])

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
    setLangList([
      ...langList,
      `${langInput.trim()}:${writtenInput}/${oralInput}`
    ])
    setLangInput('')
    setWrittenInput('débutant')
    setOralInput('débutant')
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
      realTech: [],
      newRealTechInput: '',
      newRealTechLevel: 'junior',
    }])
  }

  const confirmDelete = () => {
    if (popup.type === 'expérience') {
      const copy = [...experiences]
      copy.splice(popup.index, 1)
      setExperiences(copy)
    } else if (popup.type === 'realisation') {
      const copy = [...realisations]
      copy.splice(popup.index, 1)
      setRealisations(copy)
    }
    setPopup({ open: false, index: null, type: '' })
  }

  const updateRealisation = (index, field, value) => {
    const updated = [...realisations]
    updated[index][field] = value
    setRealisations(updated)
  }

  const addRealisation = () => {
    setRealisations([...realisations, {
      realTitle: '',
      realDescription: '',
      realTech: [],
      newRealTechInput: '',
      newRealTechLevel: 'junior',
      realFiles: [],
    }])
  }

  const addRealTech = (index) => {
    const updated = [...realisations]
    if (!updated[index].newRealTechInput.trim()) return
    updated[index].realTech.push(`${updated[index].newRealTechInput}:${updated[index].newRealTechLevel}`)
    updated[index].newRealTechInput = ''
    updated[index].newRealTechLevel = 'junior'
    setRealisations(updated)
  }

  const removeRealTech = (index, techIndex) => {
    const updated = [...realisations]
    updated[index].realTech.splice(techIndex, 1)
    setRealisations(updated)
  }

  function sanitizeFileName(name) {
    return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_')
  }

  // PATCH: Ajout d'une vraie déduplication à l'ajout de fichiers
  const onRealFilesChange = (ri, files) => {
    setRealisations(prev => {
      const updated = [...prev]
      // On écrase la liste des fichiers pour la réalisation courante avec la nouvelle liste (plus safe)
      updated[ri].realFiles = files
      return updated
    })
  }

  const removeRealFile = (ri, fileIdx) => {
    setRealisations(prev => {
      const updated = [...prev]
      updated[ri].realFiles = updated[ri].realFiles.filter((_, idx) => idx !== fileIdx)
      return updated
    })
  }

  const handleSubmit = async () => {
    if (!validate()) return

    const formData = new FormData()

    if (!profile.availableDate) profile.availableDate = ''

    const profilePayload = {
      ...profile,
      languages: langList.join(','),
    }

    const formattedExperiences = experiences.map(exp => ({
      title: exp.title,
      client: exp.client,
      description: exp.description,
      domains: exp.domains,
      languages: exp.languages,
    }))

    formData.append('profile', JSON.stringify(profilePayload))
    formData.append('address', JSON.stringify(address))
    formData.append('experiences', JSON.stringify(formattedExperiences))
    formData.append('prestations', JSON.stringify(prestations))

    if (documents.photo instanceof File) {
      formData.append('photo', documents.photo)
    } else if (documents.photo === null) {
      formData.append('removePhoto', 'true')
    }

    if (documents.cv instanceof File) {
      formData.append('cv', documents.cv)
    } else if (documents.cv === null) {
      formData.append('removeCV', 'true')
    }

    if (documents.realisationDocument instanceof File) {
      formData.append('realisationDocument', documents.realisationDocument)
    } else if (documents.realisationDocument === null) {
      formData.append('removeRealisationDocument', 'true')
    }

    // PATCH: On envoie bien tous les fichiers sans doublon
    const realFormData = new FormData()
    const realisationsPayload = realisations
      .filter(real => real.realTitle || real.realDescription || real.realTech.length)
      .map((real, idx) => ({
        ...(real.id ? { id: real.id } : {}),
        title: real.realTitle,
        description: real.realDescription,
        techs: real.realTech,
        filesToKeep: (real.realFiles || [])
          .filter(f => f.source === 'cloud')
          .map(f => f.id)
      }))
    realFormData.append('data', JSON.stringify(realisationsPayload))
    realisations.forEach((real, realIdx) => {
      (real.realFiles || []).forEach((f, fileIdx) => {
        if (f.source === 'new') {
          const sanitized = sanitizeFileName(f.name)
          const prefixedName = `real-${realIdx}-${fileIdx}-${sanitized}`
          realFormData.append('realFiles', f.file, prefixedName)
        }
      })
    })

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/profil`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: formData,
      })

      await fetch(`${import.meta.env.VITE_API_URL}/api/realisations`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: realFormData,
      })

      if (!res.ok) {
        const resText = await res.text()
        try {
          const json = JSON.parse(resText)
          console.error('Erreur backend complète :', json)
        } catch {
          console.error('Erreur backend brute :', resText)
        }
        throw new Error(resText)
      }

      navigate(`/profile?tab=${selectedTab}`)
    } catch (err) {
      alert('Erreur backend : ' + (err.message || 'inconnue'))
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
          {['profil', 'experiences', 'realisations', 'prestations'].map(tab => (
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
                <input
                  name="languages"
                  type="text"
                  value={langInput}
                  onChange={e => setLangInput(e.target.value)}
                  placeholder="Langue (ex: français)"
                />
                <select value={writtenInput} onChange={e => setWrittenInput(e.target.value)}>
                  <option value="débutant">Écrit : Débutant</option>
                  <option value="intermédiaire">Écrit : Intermédiaire</option>
                  <option value="courant">Écrit : Courant</option>
                </select>
                <select value={oralInput} onChange={e => setOralInput(e.target.value)}>
                  <option value="débutant">Oral : Débutant</option>
                  <option value="intermédiaire">Oral : Intermédiaire</option>
                  <option value="courant">Oral : Courant</option>
                </select>
                <button onClick={addLanguage}>Ajouter</button>
              </div>
              <ul className="text-sm text-gray-700 space-y-1">
                {langList.map((l, i) => {
                  const [name, levels] = l.split(':')
                  const [written, oral] = levels.split('/')
                  return (
                    <li key={i} className="flex items-center justify-between">
                      <span>{name} — écrit : {written}, oral : {oral}</span>
                      <button type="button" onClick={() => { setLangList(langList.filter((_, idx) => idx !== i)) }} className="text-red-500 text-xs hover:underline ml-4">
                        Supprimer
                      </button>
                    </li>
                  )
                })}
              </ul>
              {errors.languages && <p className="text-red-500 text-sm">{errors.languages}</p>}
            </div>
            <DocumentUpload data={documents} setData={setDocuments} />
          </>
        )}

        {selectedTab === 'experiences' && (
          <>
            <div className="flex items-center gap-6 mb-4">
              <label className="inline-flex items-center gap-2 font-semibold text-darkBlue">
                <input type="checkbox" checked={profile.isEmployed} onChange={(e) => setProfile({ ...profile, isEmployed: e.target.checked })} />
                Actuellement en poste
              </label>
              {profile.isEmployed && (
                <>
                  <label className="font-semibold text-darkBlue ml-12">Disponible à partir du</label>
                  <input
                    type="date"
                    name="availableDate"
                    min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    value={profile.availableDate}
                    onChange={(e) => setProfile({ ...profile, availableDate: e.target.value })}
                    className="border rounded px-2 py-1"
                  />
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

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={addExperience}
                className="text-darkBlue border border-darkBlue px-4 py-2 rounded hover:bg-darkBlue hover:text-white transition"
              >
                Ajouter une expérience
              </button>
            </div>
          </>
        )}

        {selectedTab === 'realisations' && (
          <>
            {realisations.map((real, i) => (
              <div key={i} className="border rounded p-4 space-y-3">
                <input
                  type="text"
                  placeholder="Titre de la réalisation"
                  value={real.realTitle}
                  onChange={e => updateRealisation(i, 'realTitle', e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                />
                <textarea
                  placeholder="Description"
                  value={real.realDescription}
                  onChange={e => updateRealisation(i, 'realDescription', e.target.value)}
                  className="border rounded px-3 py-2 w-full min-h-[100px]"
                />

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Langages et logiciels"
                    value={real.newRealTechInput}
                    onChange={e => updateRealisation(i, 'newRealTechInput', e.target.value)}
                    className="border rounded px-2 py-1 flex-1"
                  />
                  <select
                    value={real.newRealTechLevel}
                    onChange={e => updateRealisation(i, 'newRealTechLevel', e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="junior">Junior</option>
                    <option value="intermédiaire">Intermédiaire</option>
                    <option value="senior">Senior</option>
                  </select>
                  <button onClick={() => addRealTech(i)} className="bg-darkBlue text-white px-3 py-1 rounded">
                    Ajouter
                  </button>
                </div>

                <ul className="text-sm text-gray-700 space-y-1">
                  {real.realTech.map((t, j) => {
                    const [name, level] = t.split(':')
                    return (
                      <li key={j} className="flex gap-2 items-center">
                        <span>{name} : {level}</span>
                        <button type="button" onClick={() => removeRealTech(i, j)} className="text-red-500 text-xs hover:underline">
                          Supprimer
                        </button>
                      </li>
                    )
                  })}
                </ul>

                {/* Le composant Real pour upload fichiers (UN SEUL ICI) */}
                <Real
                  files={real.realFiles || []}
                  onFilesChange={newFiles => onRealFilesChange(i, newFiles)}
                />

                <ul className="text-sm text-gray-600 mt-2">
                  {(real.realFiles || []).map((file, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      {file.source === 'cloud'
                        ? <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{file.name}</a>
                        : <span>{file.name}</span>
                      }
                      <button type="button" className="ml-2 text-red-600 text-xs" onClick={() => removeRealFile(i, idx)}>
                        Supprimer
                      </button>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setPopup({ open: true, index: i, type: 'realisation' })}
                  className="text-red-600 underline text-sm ml-12"
                >
                  Supprimer cette réalisation
                </button>
              </div>
            ))}
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={addRealisation}
                className="text-darkBlue border border-darkBlue px-4 py-2 rounded hover:bg-darkBlue hover:text-white transition"
              >
                Ajouter une réalisation
              </button>
            </div>
          </>
        )}

        {selectedTab === 'prestations' && (
          <>
            {(prestations.length ? prestations : [{}]).map((p, i) => (
              <div key={i} className="border rounded p-4 space-y-3">
                <p className="font-medium text-darkBlue">Je suis capable d'assurer</p>
                <select
                  value={p.type || ''}
                  onChange={e => {
                    const copy = [...prestations]
                    copy[i] = { ...copy[i], type: e.target.value }
                    setPrestations(copy)
                  }}
                  className="border rounded px-2 py-1 w-full"
                >
                  <option value="">-- Choisir --</option>
                  <option value="la formation">la formation</option>
                  <option value="le coaching">le coaching</option>
                  <option value="la maintenance">la maintenance</option>
                  <option value="le développement">le développement</option>
                </select>
                <p className="font-medium text-darkBlue">pour</p>
                <input
                  type="text"
                  placeholder="Ex: React, Java"
                  value={p.tech || ''}
                  onChange={e => {
                    const copy = [...prestations]
                    copy[i] = { ...copy[i], tech: e.target.value }
                    setPrestations(copy)
                  }}
                  className="border rounded px-2 py-1 w-full"
                />
                <p className="font-medium text-darkBlue">à un niveau</p>
                <select
                  value={p.level || 'junior'}
                  onChange={e => {
                    const copy = [...prestations]
                    copy[i] = { ...copy[i], level: e.target.value }
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

        <div className="text-center">
          <button onClick={handleSubmit} className="bg-darkBlue text-white px-6 py-3 rounded-xl hover:bg-[#001a5c] transition">
            Enregistrer le profil
          </button>
        </div>
      </div>
    </div>
  )
}