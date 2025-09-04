import React, { useState, useEffect } from 'react'
import ProfileInfo      from '../components/sections/ProfileInfo'
import AddressInfo      from '../components/sections/AddressInfo'
import DocumentUpload   from '../components/sections/DocumentUpload'
import { fetchProfile } from '../api/fetchProfile'
import { useNavigate, useSearchParams } from 'react-router-dom'
import RealisationsEditor from '../components/RealisationsEditor'


export default function EditProfilePage() {
  /* ──────────────────────────────── STATE ─────────────────────────── */
  const [profile, setProfile] = useState({
    firstname: '',
    lastname : '',
    phone    : '',
    siret    : '',
    bio      : '',
    smallDayRate : '',
    mediumDayRate: '',
    highDayRate  : '',
    languages    : '',
    isEmployed   : false,
    availableDate: null,
    teleworkDays : 0,
    website: '',
    workerStatus: 'indep',
  })

  const [langInput,   setLangInput]   = useState('')
  const [writtenInput,setWrittenInput]= useState('débutant')
  const [oralInput,   setOralInput]   = useState('débutant')
  const [langList,    setLangList]    = useState([])
  const [loading, setLoading] = useState(false);


  const [address, setAddress] = useState({
    address   : '',
    city      : '',
    postalCode: '',
    state     : '',
    country   : '',
  })

  const [experiences, setExperiences] = useState([])
  const [prestations, setPrestations] = useState([{
    type : '',
    tech : '',
    level: 'junior',
  }])
  const [realisations, setRealisations] = useState([
    { title:'', description:'', technos:[], files:[] }
  ])

  const [documents, setDocuments] = useState({ photo: null, cv: null })
  const [errors,    setErrors   ] = useState({})
  const [error, setError] = useState(null)
  const [popup,     setPopup    ] = useState({ open: false, index: null, type: '' })

  const navigate                = useNavigate()
  const hasToken = !!localStorage.getItem('token')
  const [searchParams]          = useSearchParams()
  const initialTab              = searchParams.get('tab')
  const [selectedTab,setSelectedTab] = useState(initialTab || 'profil')

  /* ─────────────────────── INITIALISATION DONNÉES ─────────────────── */
  useEffect(() => {
    if (initialTab) setSelectedTab(initialTab)
  }, [initialTab])

   useEffect(() => {
   if (!hasToken) {
     navigate('/login', { replace: true })
   }
 }, [hasToken, navigate])


  useEffect(() => {
    if (!hasToken) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token')
        if (!token) return
        const res   = await fetchProfile(token)

        /* documents */
        const docArray = Array.isArray(res.documents)
          ? res.documents
          : Object.values(res.documents || {})
        const photoDoc = docArray.find(d => d.type === 'ID_PHOTO')
        const cvDoc    = docArray.find(d => d.type && d.type.toLowerCase() === 'cv')
        setDocuments({
          photo: photoDoc || null,
          cv   : cvDoc    ? { fileName: cvDoc.originalName || 'CV' } : null,
        })

        /* profil  ---------------------------------------------------- */
        if (res.profile) {
          const {
            firstname, lastname, phone, siret, bio,
            smallDayRate, mediumDayRate, highDayRate,
            languages, isEmployed, availableDate, workerStatus,
          } = res.profile

        setProfile({
          firstname: firstname ?? '',
          lastname : lastname  ?? '',
          phone    : phone     ?? '',
          siret    : siret     ?? '',
          bio      : bio       ?? '',
          smallDayRate : smallDayRate  ?? '',
          mediumDayRate: mediumDayRate ?? '',
          highDayRate  : highDayRate   ?? '',
          languages    : languages     ?? '',
          isEmployed   : !!isEmployed,
          availableDate: availableDate ?? '',
          website     : res.profile.website ?? '',
          workerStatus: workerStatus ?? 'indep',
        })


          setLangList((languages || '').split(','))

          /* adresse */
          if (res.profile.Address) {
            const { address, city, postalCode, state, country } = res.profile.Address
          setAddress({
            address   : address    ?? '',
            city      : city       ?? '',
            postalCode: postalCode ?? '',
            state     : state      ?? '',
            country   : country    ?? '',
          })
          }
        }

        /* expériences ------------------------------------------------- */
        if (res.experiences?.length) {
          setExperiences(res.experiences.map(exp => ({
            title : exp.title,
            client: exp.client || '',
            description: exp.description,
            domains    : exp.domains,
            languages  : Array.isArray(exp.languages) ? exp.languages : [],
            newLangInput : '',
            newLangLevel : 'junior',
          })))
        } else {
          setExperiences([{
            title: '', client: '', description: '', domains: '',
            languages: [], newLangInput: '', newLangLevel: 'junior',
          }])
        }

         /* réalisations -------------------------------------------------- */
    const realList = res.realisations || [];
    setRealisations(
      realList.length
        ? realList.map(r => ({
            id   : r.id,
            title: r.title,
            description: r.description,
            technos: r.technos || [],
            files: (r.files || []).map(f => ({
              id     : f.id,
              name   : f.originalName,
              source : 'cloud',
              version: f.version,
              publicId: f.publicId,
              format : f.format,
            })),
          }))
        : [{ title:'', description:'', technos:[], files:[] }]
    );

        /* prestations ------------------------------------------------- */
        if (res.prestations?.length) {
          setPrestations(res.prestations.map(p => ({
            type : p.type  || '',
            tech : p.tech  || '',
            level: p.level || '',
          })))
        }
      }catch (err) {
  console.error(err);
setError(err.message);
} finally {
  setLoading(false);      // <- garanti d’être exécuté
}
    }
    loadData()
  }, [])

  /* ─────────────────────────── EXPÉRIENCES ────────────────────────── */
  const updateExperience = (index, field, value) => {
    const updated       = [...experiences]
    updated[index][field] = value
    setExperiences(updated)
  }

  const addExperienceLanguage = index => {
    const updated = [...experiences]
    updated[index].languages.push(
      `${updated[index].newLangInput}:${updated[index].newLangLevel}`
    )
    updated[index].newLangInput = ''
    updated[index].newLangLevel = 'junior'
    setExperiences(updated)
  }

  const removeExperienceLanguage = (expIdx, langIdx) => {
    const updated = [...experiences]
    updated[expIdx].languages.splice(langIdx, 1)
    setExperiences(updated)
  }

  const addExperience = () =>
    setExperiences([...experiences, {
      title: '', client: '', description: '', domains: '',
      languages: [], newLangInput: '', newLangLevel: 'junior',
    }])

  /* ─────────────────────────── REALISATIONS ────────────────────────── */
const addRealisation = () =>
  setRealisations([...realisations,
    { title:'', description:'', technos:[], files:[] }])

const updateReal = (idx, newData) => {
  const copy = [...realisations]
  copy[idx]  = newData
  setRealisations(copy)
}
const removeReal = idx =>
  setRealisations(realisations.filter((_,i)=>i!==idx))

  /* ─────────────────────────── PRESTATIONS ────────────────────────── */
  const addPrestation    = () => setPrestations([...prestations, { type:'', tech:'', level:'junior' }])
  const removePrestation = i => {
    if (prestations.length <= 1) return
    const copy = [...prestations]
    copy.splice(i,1)
    setPrestations(copy)
  }

  /* ─────────────────────────────── LANGUES ────────────────────────── */
  const addLanguage = () => {
    if (!langInput.trim()) return
    setLangList([
      ...langList,
      `${langInput.trim()}:${writtenInput}/${oralInput}`,
    ])
    setLangInput('')
    setWrittenInput('débutant')
    setOralInput('débutant')
  }

  /* ───────────────────────── VALIDATION FORM ──────────────────────── */
const isEmpty = v => (v ?? '').toString().trim() === '';

const validate = () => {
  const e = {}
  if (isEmpty(profile.firstname))    e.firstname    = 'Champ obligatoire'
  if (isEmpty(profile.lastname))     e.lastname     = 'Champ obligatoire'
  // (siret non obligatoire)
  if (isEmpty(profile.bio))          e.bio          = 'Champ obligatoire'
  if (!profile.smallDayRate)         e.smallDayRate = 'Champ obligatoire'
  if (isEmpty(address.address))      e.address      = 'Champ obligatoire'
  if (isEmpty(address.city))         e.city         = 'Champ obligatoire'
  if (isEmpty(address.postalCode))   e.postalCode   = 'Champ obligatoire'
  if (isEmpty(address.country))      e.country      = 'Champ obligatoire'
  if (!langList?.length)             e.languages    = 'Champ obligatoire'
  setErrors(e)
  return Object.keys(e).length === 0
}


/* ───────────────────────────── SUBMIT ───────────────────────────── */
const handleSubmit = async () => {
  if (!validate()) return;
  const tk = localStorage.getItem('token')
 if (!tk) { navigate('/login', { replace: true }); return }

  /* ---------- 1. FormData “profil” (+ expériences, prestations, docs) */
  const formData = new FormData();

  // profil + adresse
  formData.append(
    'profile',
    JSON.stringify({ ...profile, languages: langList.join(',') })
  );
  formData.append('address', JSON.stringify(address));

  // expériences
  const formattedExperiences = experiences.map(
    ({ newLangInput, newLangLevel, ...rest }) => rest
  );
  formData.append('experiences', JSON.stringify(formattedExperiences));

  // prestations
  formData.append('prestations', JSON.stringify(prestations));

  // documents (photo / cv)
  if (documents.photo instanceof File) formData.append('photo', documents.photo);
  else if (documents.photo === null)   formData.append('removePhoto', 'true');

  if (documents.cv   instanceof File) formData.append('cv', documents.cv);
  else if (documents.cv === null)     formData.append('removeCV', 'true');

  /* ---------- 2. FormData “réalisations” (+ PDF) */
  const realFormData = new FormData();

  // payload JSON des réals
  const realJSON = realisations.map(r => ({
    id         : r.id,
    title      : r.title,
    description: r.description,
    technos      : r.technos,                   // [{ name, level }, …]
    files      : r.files
                  .filter(f => f.id)        // fichiers déjà existants
                  .map(f => ({ id: f.id })),
  }));
  realFormData.append('data', JSON.stringify(realJSON));

  // fichiers PDF nouvellement ajoutés
  realisations.forEach((r, rIdx) => {
    r.files.forEach((f, fIdx) => {
      if (f.source === 'new' && f.file) {
        const cleanName = f.file.name.replace(/\s+/g, '_');
        realFormData.append(
          `realFiles_${rIdx}`,
          f.file,
          `real-${rIdx}-${fIdx}-${cleanName}`
        );
      }
    });
  });

  /* ---------- 3. DEBUG (facultatif) ---------------------------------- */
  console.log('--- DEBUG FormData profil ---');
  for (const [k, v] of formData.entries()) {
    console.log(k, v instanceof File ? `[File] ${v.name}` : v);
  }
  console.log('--- DEBUG FormData réals ---');
  for (const [k, v] of realFormData.entries()) {
    console.log(k, v instanceof File ? `[File] ${v.name}` : v);
  }

  /* ---------- 4. appels backend ------------------------------------- */
  try {
    const token = localStorage.getItem('token');

    // 4-a : profil / expériences / prestations / docs
    const profilRes = await fetch(
      `${import.meta.env.VITE_API_URL}/api/profile/profil`,
      { method:'POST', headers:{ Authorization:`Bearer ${token}` }, body: formData }
    );
    if (!profilRes.ok) throw new Error(await profilRes.text());

    // 4-b : réalisations + fichiers
    const realRes = await fetch(
      `${import.meta.env.VITE_API_URL}/api/realisations`,
      { method:'POST', headers:{ Authorization:`Bearer ${token}` }, body: realFormData }
    );
    if (!realRes.ok) throw new Error(await realRes.text());

    /* ---------- 5. succès → retour au profil ------------------------- */
navigate(`/profile?tab=${selectedTab}`, { replace: true });
  } catch (err) {
    alert('Erreur backend : ' + (err.message || 'inconnue'));
  }
}; 

if (error) return <p className="text-red-500 p-4">Erreur : {error}</p>;

const fieldLabels = {
  firstname   : 'Prénom',
  lastname    : 'Nom',
  phone       : 'Téléphone',
  bio         : 'Bio',
  smallDayRate: 'TJM',
  address     : 'Adresse',
  city        : 'Ville',
  postalCode  : 'Code postal',
  country     : 'Pays',
  languages   : 'Langues',
};

  /* ───────────────────────────── RENDER ───────────────────────────── */
  if (!hasToken) return null
return (
  <div className="min-h-screen bg-primary flex justify-center px-4 py-10">
    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-6 space-y-10 relative">
      {/* ───── Popup suppression ───── */}
      {popup.open && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center space-y-4 max-w-sm">
            <p className="text-lg">
              Voulez-vous supprimer cette {popup.type} ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  if (popup.type === 'expérience') {
                    const copy = [...experiences]
                    copy.splice(popup.index, 1)
                    setExperiences(copy)
                  } else if (popup.type === 'prestation') {
                    removePrestation(popup.index)
                  }
                  setPopup({ open: false, index: null, type: '' })
                }}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Oui
              </button>
              <button
                onClick={() => setPopup({ open: false, index: null, type: '' })}
                className="border px-4 py-2 rounded"
              >
                Non
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───── Tabs ───── */}
      <h1 className="text-2xl text-darkBlue font-bold text-center">
        Modifier mon profil
      </h1>
      <div className="flex gap-3 justify-center">
        {['profil', 'experiences', 'realisations', 'prestations'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-xl font-semibold ${
              selectedTab === tab
                ? 'bg-blue-100 text-darkBlue'
                : 'hover:bg-blue-50'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ───── PROFIL ───── */}
      {selectedTab === 'profil' && (
        <>
         <div className="space-y-2">
            <label className="text-xl font-semibold text-darkBlue">Statut</label>
            <div className="flex gap-6">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="workerStatus"
                  value="indep"
                  checked={profile.workerStatus === 'indep'}
                  onChange={(e)=>setProfile({ ...profile, workerStatus: e.target.value })}
                />
                Indépendant
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="workerStatus"
                  value="salarie"
                  checked={profile.workerStatus === 'salarie'}
                  onChange={(e)=>setProfile({ ...profile, workerStatus: e.target.value })}
                />
                Salarié
              </label>
            </div>
          </div>
          <ProfileInfo data={profile} setData={setProfile} errors={errors} />
          <AddressInfo data={address} setData={setAddress} errors={errors} />

        <input
          type="text"
          placeholder="Lien vers votre portfolio ou site"
          value={profile.website || ''}
          onChange={e => setProfile({ ...profile, website: e.target.value })}
          className="border rounded px-3 py-2 w-full"
        />


          {/* langues */}
          <div className="space-y-2">
            <label className="text-xl font-semibold text-darkBlue">
              Langues
            </label>
            <div className="flex gap-2">
              <input
                name="languages"
                type="text"
                value={langInput}
                onChange={e => setLangInput(e.target.value)}
                placeholder="Langue (ex: français)"
              />
              <select
                value={writtenInput}
                onChange={e => setWrittenInput(e.target.value)}
              >
                <option value="débutant">Écrit : Débutant</option>
                <option value="intermediaire">Écrit : Intermédiaire</option>
                <option value="courant">Écrit : Courant</option>
              </select>
              <select
                value={oralInput}
                onChange={e => setOralInput(e.target.value)}
              >
                <option value="débutant">Oral : Débutant</option>
                <option value="intermediaire">Oral : Intermédiaire</option>
                <option value="courant">Oral : Courant</option>
              </select>
              <button onClick={addLanguage}>Ajouter</button>
            </div>

            <ul className="text-sm text-gray-700 space-y-1">
              {langList.filter(Boolean).map((l, i) => {
               const [name, levels]   = (l || '').split(':');
                const [written = '–', oral = '–'] = (levels || '').split('/');

                return (
                  <li key={i} className="flex items-center justify-between">
                    <span>
                      {name} — écrit : {written}, oral : {oral}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setLangList(langList.filter((_, idx) => idx !== i))
                      }
                      className="text-red-500 text-xs hover:underline ml-4"
                    >
                      Supprimer
                    </button>
                  </li>
                )
              })}
            </ul>
            {errors.languages && (
              <p className="text-red-500 text-sm">{errors.languages}</p>
            )}
          </div>

          {/* documents */}
          <DocumentUpload data={documents} setData={setDocuments} />
        </>
      )}

      {/* ───── EXPÉRIENCES ───── */}
      {selectedTab === 'experiences' && (
        <>
          {/* statut dispo */}
          <div className="flex items-center gap-6 mb-4">
            <label className="inline-flex items-center gap-2 font-semibold text-darkBlue">
              <input
                type="checkbox"
                checked={profile.isEmployed}
                onChange={e =>
                  setProfile({ ...profile, isEmployed: e.target.checked })
                }
              />
              Actuellement en poste
            </label>
            {profile.isEmployed && (
              <>
                <label className="font-semibold text-darkBlue ml-12">
                  Disponible à partir du
                </label>
                <input
                  type="date"
                  name="availableDate"
                  min={new Date(Date.now() + 86_400_000)
                    .toISOString()
                    .split('T')[0]}
                  value={profile.availableDate}
                  onChange={e =>
                    setProfile({ ...profile, availableDate: e.target.value })
                  }
                  className="border rounded px-2 py-1"
                />
              </>
            )}
          </div>

          {/* liste expériences */}
          {experiences.map((exp, i) => (
            <div key={i} className="border rounded p-4 space-y-3">
              <input
                type="text"
                placeholder="Titre de l'expérience"
                value={exp.title}
                onChange={e => updateExperience(i, 'title', e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
              <input
                type="text"
                placeholder="Client"
                value={exp.client || ''}
                onChange={e => updateExperience(i, 'client', e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
              <input
                type="text"
                placeholder="Domaines"
                value={exp.domains}
                onChange={e => updateExperience(i, 'domains', e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
              <textarea
                placeholder="Description"
                value={exp.description}
                onChange={e =>
                  updateExperience(i, 'description', e.target.value)
                }
                className="border rounded px-3 py-2 w-full min-h-[120px]"
              />

              {/* langages / logiciels */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Langages et logiciels"
                  value={exp.newLangInput}
                  onChange={e =>
                    updateExperience(i, 'newLangInput', e.target.value)
                  }
                  className="border rounded px-2 py-1 flex-1"
                />
                <select
                  value={exp.newLangLevel}
                  onChange={e =>
                    updateExperience(i, 'newLangLevel', e.target.value)
                  }
                  className="border rounded px-2 py-1"
                >
                  <option value="junior">Junior</option>
                  <option value="intermediaire">Intermédiaire</option>
                  <option value="senior">Senior</option>
                </select>
                <button
                  onClick={() => addExperienceLanguage(i)}
                  className="bg-darkBlue text-white px-3 py-1 rounded"
                >
                  Ajouter
                </button>
              </div>

             {/* chips langages */}
<ul className="text-sm text-gray-700 space-y-1">
  {Array.isArray(exp.languages) &&
    exp.languages.filter(Boolean).map((l, j) => {
      const [name, level] = (l || '').split(':');
      return (
        <li key={j} className="flex gap-2 items-center">
          <span>
            {name} : {level}
          </span>
          <button
            type="button"
            onClick={() => removeExperienceLanguage(i, j)}
            className="text-red-500 text-xs hover:underline"
          >
            Supprimer
          </button>
        </li>
      );
    })}
</ul>


              <button
                onClick={() =>
                  setPopup({ open: true, index: i, type: 'expérience' })
                }
                className="text-red-600 underline text-sm"
              >
                Supprimer cette expérience
              </button>
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

      {/* ───── RÉALISATIONS ───── */}
      {selectedTab==='realisations' && (
        <>
          <h2 className="text-xl font-bold text-darkBlue">Mes réalisations</h2>
          {realisations.map((r,i)=>(
            <RealisationsEditor
              key={i}
              data={r}
              onChange={d=>updateReal(i,d)}
              onRemove={()=>removeReal(i)}
              canRemove={realisations.length>1}
            />
          ))}
          <button
            onClick={addRealisation}
            className="border border-darkBlue px-4 py-2 rounded mt-3 hover:bg-darkBlue hover:text-white">
            Ajouter une réalisation
          </button>
        </>
      )}

      {/* ───── PRESTATIONS ───── */}
      {selectedTab === 'prestations' && (
        <>
          {prestations.map((p, i) => (
            <div key={i} className="border rounded p-4 space-y-3">
              <p className="font-medium text-darkBlue">
                Je suis capable d'assurer
              </p>
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
                <option value="intermediaire">intermédiaire</option>
                <option value="expert">expert</option>
              </select>

              <button
                type="button"
                onClick={() =>
                  setPopup({ open: true, index: i, type: 'prestation' })
                }
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
              onClick={addPrestation}
              className="text-darkBlue border border-darkBlue px-4 py-2 rounded hover:bg-darkBlue hover:text-white transition"
            >
              Ajouter une prestation
            </button>
          </div>
        </>
      )}

      {/* ───── SUBMIT ───── */}
      {Object.keys(errors).length > 0 && (
      <p className="text-red-600 text-center mb-4 text-lg font-bold">
        Le champ {fieldLabels[Object.keys(errors)[0]] || Object.keys(errors)[0]} doit être rempli pour valider.
      </p>


      )}
      <div className="text-center mt-8">
        <button
          onClick={handleSubmit}
          className="bg-darkBlue text-white px-6 py-3 rounded-xl hover:bg-[#001a5c] transition"
        >
          Enregistrer le profil
        </button>
      </div>

    </div>
  </div>
)
}
