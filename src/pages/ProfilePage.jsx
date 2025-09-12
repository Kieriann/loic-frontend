// ─── Page : affichage du profil utilisateur connecté (avec “réalisations”) ───

import React, { useEffect, useState } from 'react';
import { fetchProfile }               from '../api/fetchProfile';
import { Navigate, useNavigate }      from 'react-router-dom';
import axios                          from 'axios';
import { useSearchParams }            from 'react-router-dom';
import IndepMessagerie from '../components/IndepMessagerie';



export default function ProfilePage() {
  /* ------------------------------------------------------------------ */
  /* State                                                              */
  /* ------------------------------------------------------------------ */
  const [data,         setData        ] = useState(null);
  const [loading,      setLoading     ] = useState(true);
  const [realisations, setRealisations] = useState([]);     //
  const [documents,    setDocuments   ] = useState([]);

  /* Onglet actif ------------------------------------------------------ */
  const [searchParams]     = useSearchParams();
  const initialTab         = searchParams.get('tab');
  const [selectedTab, setSelectedTab] = useState(initialTab || 'profil');

  const navigate = useNavigate();
  const hasToken = !!localStorage.getItem('token');
  useEffect(() => {
  setData(null);
  setRealisations([]);
  setDocuments([]);
}, [localStorage.getItem('token')]);


    useEffect(() => {
      if (!localStorage.getItem('token')) {
        navigate('/login', { replace: true })
      }
    }, [navigate])


    const [unreadCount, setUnreadCount] = useState(0)
    const [sugTitle, setSugTitle]       = useState('')
    const [sugContent, setSugContent]   = useState('')
    const [sugMsg, setSugMsg]           = useState('')
    const [sugLoading, setSugLoading]   = useState(false)


useEffect(() => {
  const fetchCount = () => {
    axios.get('/api/messages/unread/count', { withCredentials: true })
      .then(res => setUnreadCount(res.data.unreadCount))
      .catch(err => console.error(err))
  }

  fetchCount()
  const interval = setInterval(fetchCount, 5000)
  return () => clearInterval(interval)
}, [])


  /* ------------------------------------------------------------------ */
  /* Chargement profil + réalisations                                   */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res   = await fetchProfile(token);        // ← profil + réalisations
        setData(res);
        setRealisations(res.realisations || []); 
        setDocuments(res.documents || []);
      } catch (err) {
        console.error('Erreur chargement profil :', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);


  /* ------------------------------------------------------------------ */
  /* Redirections / états                                               */
  /* ------------------------------------------------------------------ */
   if (!hasToken) return null;
  if (loading) return <p className="p-4">Chargement…</p>;
  if (!data?.profile || !data.profile.firstname)
    return <Navigate to="/profile/edit" replace />;

const { profile, address = {}, experiences = [], prestations = [], memberStatus } = data;

async function handleSendSuggestion(e) {
  e?.preventDefault?.()
  setSugMsg('')
  if (!sugTitle.trim() || !sugContent.trim()) {
    setSugMsg('Titre et contenu requis.')
    return
  }
  const token = localStorage.getItem('token')
  if (!token) { navigate('/login', { replace: true }); return }

  setSugLoading(true)
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suggestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: sugTitle.trim(), content: sugContent.trim() })
    })
    if (!res.ok) {
      const err = await res.json().catch(()=>({}))
      throw new Error(err.error || 'Erreur serveur')
    }
    const data = await res.json()
    setSugMsg(`Suggestion enregistrée`)
    setSugTitle('')
    setSugContent('')
  } catch (err) {
    setSugMsg(err.message)
  } finally {
    setSugLoading(false)
  }
}
  /* ------------------------------------------------------------------ */
  /* Rendu                                                              */
  /* ------------------------------------------------------------------ */
  return (
    <div className="min-h-screen bg-primary flex justify-center px-4 py-10">
      <div className="w-full max-w-6xl flex gap-6 items-stretch">
        {/* ───── Onglets latéraux ───── */}
        <div className="w-48 bg-white rounded-2xl shadow-md p-6 h-full">
         <div className="flex flex-col gap-3">
{['profil', 'experiences', 'realisations', 'prestations', 'messages', 'suggestions'].map(tab => (
  <React.Fragment key={tab}>
    {tab === 'suggestions' && <div className="my-3 border-t border-gray-200" />}
    <button
      onClick={() => setSelectedTab(tab)}
      className={`w-full rounded-xl px-4 py-2 font-semibold text-left ${
        selectedTab === tab
          ? 'bg-blue-100 text-darkBlue'
          : 'hover:bg-blue-50'
      }`}
    >
      <span className="flex justify-between items-center w-full">
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
        {tab === 'messages' && unreadCount > 0 && (
          <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
            {unreadCount}
          </span>
        )}
      </span>
    </button>
  </React.Fragment>
))}
  </div>
</div>




        {/* ───── Contenu central ───── */}
        <div className="flex-1 bg-white rounded-2xl shadow-md p-6 space-y-10">


          {/* En-tête + bouton modifier */}
        <div className="mb-8">
          {/* Titre centré en haut */}
          {/* Titre + bouton modifier alignés au centre */}
        <div className="flex justify-center items-center gap-4 mb-2">
          <h1 className="text-2xl text-darkBlue font-bold">
            {selectedTab === 'profil'        && 'Mon Profil'}
            {selectedTab === 'experiences'   && 'Mes Expériences'}
            {selectedTab === 'realisations'  && 'Mes Réalisations'}
            {selectedTab === 'prestations'   && 'Mes Prestations'}
            {selectedTab === 'suggestions'  && 'Suggestions'}

          </h1>

          <button
            onClick={() => navigate(`/profile/edit?tab=${selectedTab}`)}
            className="text-sm text-darkBlue border border-darkBlue px-4 py-2 rounded hover:bg-darkBlue hover:text-white transition"
          >
            Modifier
          </button>
        </div>

        {/* Badge membre en dessous à droite */}
        <div className="flex justify-end">
          <span
            className={`inline-block px-6 py-2 rounded-full text-lg font-bold shadow
              ${memberStatus === 'vip'     ? 'bg-yellow-300 text-yellow-900'
              : memberStatus === 'abonne' ? 'bg-green-200 text-green-800'
              : 'bg-blue-200 text-blue-800'}`}
          >
        Statut : {memberStatus === 'vip' ? 'VIP'
          : memberStatus === 'abonne' ? 'Abonné'
          : 'Inscrit'}

          </span>
        </div>

        </div>

                          {/* ─────────────────────────── SUGGESTIONS ──────────────────── */}
{selectedTab === 'suggestions' && (
  <Section title="Proposer une amélioration">
    <form onSubmit={handleSendSuggestion} className="space-y-3 max-w-xl mx-auto">
      <input
        type="text"
        value={sugTitle}
        onChange={e => setSugTitle(e.target.value)}
        placeholder="Titre — ce qu’il faudrait ajouter/améliorer"
        className="w-full border rounded-lg px-3 py-2 text-sm placeholder-gray-500"
        maxLength={150}
        required
      />
      <textarea
        value={sugContent}
        onChange={e => setSugContent(e.target.value)}
        placeholder="Décrivez votre idée (contexte, besoin, impact…)"
        className="w-full h-40 border rounded-lg px-3 py-2 text-sm placeholder-gray-500"
        required
      />
      <button
        type="submit"
        disabled={sugLoading}
        className="px-4 py-2 rounded-lg bg-blue-500 text-white disabled:opacity-50"
      >
        {sugLoading ? 'Envoi…' : 'Envoyer la suggestion'}
      </button>
      {sugMsg ? <p className="text-sm mt-1">{sugMsg}</p> : null}
    </form>
  </Section>
)}


          {/* ────────────────────────────────── PROFIL ────────────────── */}
          {selectedTab === 'profil' && (
            <>
              <p className="text-center text-2xl italic font-semibold text-darkBlue">
                {profile.firstname} {profile.lastname}
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Infos */}
                <Section title="Informations">
                  <Line label="Téléphone">{profile.phone}</Line>
                  <Line label="SIRET">{profile.siret}</Line>
                  <Line label="En poste">{profile.isEmployed ? 'Oui' : 'Non'}</Line>


                  <Line label="Statut">
                    {profile.workerStatus === 'indep'
                      ? 'Indépendant'
                      : profile.workerStatus === 'salarie'
                      ? 'Salarié'
                      : null}
                  </Line>
                  <Line label="Bio">{profile.bio}</Line>
                  <Line label="Lien">
                  {profile.website ? (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {profile.website}
                    </a>
                  ) : (
                    <span className="text-gray-500 italic">Non renseigné</span>
                  )}
                </Line>

                </Section>

                {/* Adresse */}
                <Section title="Adresse" borderLeft>
                  <Line label="Adresse">{address.address}</Line>
                  <Line label="Code postal">{address.postalCode}</Line>
                  <Line label="Ville">{address.city}</Line>
                  <Line label="Pays">{address.country}</Line>
                </Section>
              </div>

              {/* Tarifs */}
              <Section title="Tarifs journaliers" className="text-center">
                <Line label="Courte durée">{profile.smallDayRate} €</Line>
                <Line label="Moyenne durée">{profile.mediumDayRate} €</Line>
                <Line label="Longue durée">{profile.highDayRate} €</Line>
              </Section>

              {/* Télétravail */}
              <Section title="Télétravail" className="text-center">
                <p>
                  Je souhaite télétravailler <strong>{profile.teleworkDays}</strong> jour
                  {profile.teleworkDays > 1 ? 's' : ''} par semaine.
                </p>
              </Section>

             {/* Langues */}
<Section title="Langues">
  <ul className="text-base text-gray-800 pl-5 max-w-xl mx-auto text-center">
    {(profile.languages || '')
      .split(',')
      .filter(Boolean)
      .map((l, i) => {
        const [name, levels] = (l || '').split(':');
        const [written = '–', oral = '–'] = (levels || '').split('/');
        return (
          <li key={i}>
            {name} — écrit : {written}, oral : {oral}
          </li>
        );
      })}
  </ul>
</Section>

              {/* Documents */}
              <Section title="Documents">
                <div className="grid grid-cols-2 gap-10 items-center">
                  {/* Photo */}
                  <div className="text-center">
                    <h3 className="font-semibold text-darkBlue mb-4">Photo</h3>
                    {documents.filter(d => d.type === 'ID_PHOTO').map(doc => (
                      <img
                        key={doc.id}
                        src={`https://res.cloudinary.com/dwwt3sgbw/image/upload/v${doc.version}/${doc.publicId}.${doc.format}`}
                        alt="ID"
                        className="mx-auto rounded-full w-32 h-32 object-cover"
                      />
                    ))}
                  </div>

                  {/* CV */}
                  <div className="text-center">
                    <h3 className="font-semibold text-darkBlue mb-4">CV</h3>
                    {documents.filter(d => d.type?.toLowerCase() === 'cv').map(doc => (
                      <a
                        key={doc.id}
                        href={`https://res.cloudinary.com/dwwt3sgbw/image/upload/v${doc.version}/${doc.publicId}.${doc.format}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline block"
                      >
                        {doc.originalName || 'CV'}
                      </a>
                    ))}
                  </div>
                </div>
              </Section>
            </>
          )}

          {/* ─────────────────────────── EXPERIENCES ──────────────────── */}
          {selectedTab === 'experiences' && (
            <Section title="Expériences">
              {/* disponibilité */}
              <div className="text-center mb-6">
                {profile.isEmployed ? (
                  <p className="text-red-600 font-semibold">
                    Disponible à partir du{' '}
                    {profile.availableDate ? (
                      <strong>
                        {new Date(profile.availableDate).toLocaleDateString('fr-FR')}
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

              {/* liste */}
              {experiences.length === 0 && (
                <p className="text-gray-500 italic">Aucune expérience renseignée</p>
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
                    {Array.isArray(exp.languages) && exp.languages.length
                      ? exp.languages.map((l, j) => {
                      const [name, level] = (l || '').split(':');
                          return (
                            <span key={j}>
                              {name} ({level})
                              {j < exp.languages.length - 1 ? ', ' : ''}
                            </span>
                          );
                        })
                      : 'Aucun'}
                  </p>
                </div>
              ))}
            </Section>
          )}

          {/* ─────────────────────────── RÉALISATIONS ─────────────────── */}
          {selectedTab === 'realisations' && (
            <Section title="Réalisations">
              {realisations.length ? (
                realisations.map(r => (
                  <div key={r.id} className="border rounded p-4 mb-4 bg-[#f8fbff]">
                    <p><strong>Titre :</strong> {r.title}</p>
                    <p><strong>Description :</strong> {r.description}</p>

                    {r.technos?.length > 0 && (
                      <p>
                        <strong>Technos :</strong>{' '}
                        {r.technos.map((t, i) =>
                          `${t.name} (${t.level})${i < r.technos.length - 1 ? ', ' : ''}`
                        )}
                      </p>
                    )}
{r.files?.length > 0 &&
  r.files.map(f => (
    <a
      key={f.id}
      href={`https://res.cloudinary.com/dwwt3sgbw/image/upload/v${f.version}/${f.publicId}.${f.format}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline block"
    >
      {f.originalName || 'Document'}
    </a>
  ))}


                  </div>
                ))
              ) : (
                <p className="italic text-gray-500">Aucune réalisation</p>
              )}
            </Section>
          )}

          {/* ─────────────────────────── PRESTATIONS ──────────────────── */}
          {selectedTab === 'prestations' && (
            <Section title="Prestations">
              {prestations.length ? (
                prestations.map((p, i) => (
                  <p key={i} className="mb-2">
                    Je suis capable d’assurer <strong>{p.type}</strong> pour{' '}
                    <strong>{p.tech}</strong> à un niveau <strong>{p.level}</strong>.
                  </p>
                ))
              ) : (
                <p className="text-gray-500 italic">Aucune prestation renseignée</p>
              )}
            </Section>
          )}
          
        {/* ─────────────────────────── MESSAGERIE ──────────────────── */}
        {selectedTab === 'messages' && (
          <Section title="Messagerie">
            <IndepMessagerie />
          </Section>
        )}

        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* Helpers UI                                                           */
/* -------------------------------------------------------------------- */
function Section({ title, children, borderLeft = false, className = '' }) {
  return (
    <div
      className={`space-y-6 ${
        borderLeft ? 'lg:pl-8 lg:border-l border-primary' : ''
      } ${className}`}
    >
      <div className="bg-[#f8fbff] p-6 rounded-xl shadow-sm w-full">
        <h2 className="text-xl font-bold text-darkBlue text-center mb-8">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

function Line({ label, children }) {
  return (
    <p>
      <strong className="text-darkBlue">{label} :</strong>{' '}
      {children || <span className="text-gray-500 italic">Non renseigné</span>}
    </p>
  );
}



