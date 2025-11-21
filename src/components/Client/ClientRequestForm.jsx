import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import cx from 'classnames'
import CitySelect from './CitySelect'
import { createClientRequest } from '../../api'
import { getClientRequest, updateClientRequest } from '../../api/clientRequests'
import { computeShortlist } from '../../api/shortlist'
import ShortlistDebug from './ShortlistDebug'
import {
  listClientSavedSearches,
  createClientSavedSearch,
  updateClientSavedSearch,
  deleteClientSavedSearch,
} from '../../api/clientSavedSearches'

 export default function ClientRequestForm({ selectedSavedSearch, onNewSavedSearch }) {
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')

  /* ── Choix simples ──────────────────────────────────────────────── */
  const [kind, setKind] = useState('mission') // expertise | mission | preembauche | alternance

  // TJM
  const [tjmMin, setTjmMin] = useState('')
  const [tjmMax, setTjmMax] = useState('')
  const [tjmWeight, setTjmWeight] = useState(1)

  // Localisation
  const [remote, setRemote] = useState(true)
  const [remoteDaysCount, setRemoteDaysCount] = useState(1)
  const [locationWeight, setLocationWeight] = useState(1)
  const [city, setCity] = useState(null)

  // Technologies (par onglet)
  const [techRowsByKind, setTechRowsByKind] = useState({
    expertise: [{ technology: '', level: 'junior', weight: 1 }],
    mission: [{ technology: '', level: 'junior', weight: 1 }],
    preembauche: [{ technology: '', level: 'junior', weight: 1 }],
    alternance: [{ technology: '', level: 'junior', weight: 1 }],
  })
  const techRows = techRowsByKind[kind] || techRowsByKind.expertise

  // Expertise
  const [expertiseObjective, setExpertiseObjective] = useState('')
  const [expertiseBudget, setExpertiseBudget] = useState('')
  const [expertiseUrgency, setExpertiseUrgency] = useState('moyenne')
  const [expertiseUrgencyWeight, setExpertiseUrgencyWeight] = useState(1)
  const importanceOptions = Array.from({ length: 10 }, (_, i) => i + 1)

  const levelLabel = (v) =>
    (
      {
        beginner: 'Débutant',
        junior: 'Junior',
        intermediate: 'Intermédiaire',
        senior: 'Senior',
        expert: 'Expert',
      }
    )[String(v || '').toLowerCase()] || v

  // Pré-embauche
  const [prehireJobTitle, setPrehireJobTitle] = useState('')
  const [prehireContractType, setPrehireContractType] = useState('')
  const [prehireTrialPeriod, setPrehireTrialPeriod] = useState('')
  const [prehireCompensation, setPrehireCompensation] = useState('')

  // Alternance
  const [alternanceJobTitle, setAlternanceJobTitle] = useState('')
  const [alternanceDescription, setAlternanceDescription] = useState('')
  const [alternanceStudyLevel, setAlternanceStudyLevel] = useState('') // niveau d’études actuel
  const [alternanceRemuMode, setAlternanceRemuMode] = useState('BAREME') // BAREME | SUPERIEURE
  const [alternanceRemuAmount, setAlternanceRemuAmount] = useState('')

  // UI
  const [loading, setLoading] = useState(false)
  const [successId, setSuccessId] = useState(null)
  const [error, setError] = useState('')
  const [showValidationMsg, setShowValidationMsg] = useState(false)
  const shortlistRef = useRef(null)

  // Shortlist (Cas 2 direct)
  const [shortlistByKind, setShortlistByKind] = useState({
    expertise: [],
    mission: [],
    preembauche: [],
    alternance: [],
  })
  const shortlist = shortlistByKind[kind] || []
  const [loadingShortlist, setLoadingShortlist] = useState(false)
  const [lastWeights, setLastWeights] = useState(null)

  useEffect(() => {
    if (!loadingShortlist && (shortlist?.length || 0) > 0) {
      shortlistRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [loadingShortlist, shortlist])

  // Recherches enregistrées
  const [savedSearches, setSavedSearches] = useState([])
  const [isLoadingSaved, setIsLoadingSaved] = useState(false)

  useEffect(() => {
  if (!selectedSavedSearch || !selectedSavedSearch.query) return
  applySavedSearch(selectedSavedSearch)
}, [selectedSavedSearch])


  useEffect(() => {
    const run = async () => {
      try {
        setIsLoadingSaved(true)
        const rows = await listClientSavedSearches()
        setSavedSearches(rows)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoadingSaved(false)
      }
    }
    run()
  }, [])

  const applySavedSearch = (search) => {
    if (!search || !search.query) return
    const q = search.query || {}
    const savedKind = q.kind || 'mission'

    setKind(savedKind)

    setTjmMin(q.tjmMin ?? '')
    setTjmMax(q.tjmMax ?? '')
    setTjmWeight(q.tjmWeight ?? 1)

    setRemote(q.remote ?? true)
    setRemoteDaysCount(q.remoteDaysCount ?? 1)
    setLocationWeight(q.locationWeight ?? 1)
    setCity(q.city ?? null)

    setExpertiseObjective(q.expertiseObjective ?? '')
    setExpertiseBudget(q.expertiseBudget ?? '')
    setExpertiseUrgency(q.expertiseUrgency ?? 'moyenne')
    setExpertiseUrgencyWeight(q.expertiseUrgencyWeight ?? 1)

    setPrehireJobTitle(q.prehireJobTitle ?? '')
    setPrehireContractType(q.prehireContractType ?? '')
    setPrehireTrialPeriod(q.prehireTrialPeriod ?? '')
    setPrehireCompensation(q.prehireCompensation ?? '')

    setAlternanceJobTitle(q.alternanceJobTitle ?? '')
    setAlternanceDescription(q.alternanceDescription ?? '')
    setAlternanceStudyLevel(q.alternanceStudyLevel ?? '')
    setAlternanceRemuMode(q.alternanceRemuMode ?? 'BAREME')
    setAlternanceRemuAmount(q.alternanceRemuAmount ?? '')

    setTechRowsByKind((prev) => {
      const rows = Array.isArray(q.techRows) && q.techRows.length
        ? q.techRows
        : [{ technology: '', level: 'junior', weight: 1 }]
      return { ...prev, [savedKind]: rows }
    })
  }

  const handleRenameSavedSearch = async (search) => {
    const nextName = window.prompt('Nouveau nom de la recherche', search.name)
    if (!nextName || !nextName.trim()) return
    try {
      const updated = await updateClientSavedSearch(search.id, { name: nextName.trim() })
      setSavedSearches((prev) => prev.map((s) => (s.id === search.id ? updated : s)))
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteSavedSearch = async (id) => {
    if (!window.confirm('Supprimer cette recherche ?')) return
    try {
      await deleteClientSavedSearch(id)
      setSavedSearches((prev) => prev.filter((s) => s.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  // ─── Click shortlist avec validation visible ───────────────────────
  const onClickShortlist = () => {
    if (!canSearch) {
      setShowValidationMsg(true)
      return
    }
    setShowValidationMsg(false)
    handleComputeShortlist()
  }

  const [weights, setWeights] = useState({
    skills: 5,
    tjm: 3,
    telework: 2,
    availability: 2,
  })

  /* ── Chargement édition ────────────────────────────────────────── */
  useEffect(() => {
    if (!editId) return
    ;(async () => {
      const r = await getClientRequest(editId)

      if (r.kind === 'MISSION') setKind('mission')
      else if (r.kind === 'PREEMBAUCHE') setKind('preembauche')
      else if (r.kind === 'ALTERNANCE') setKind('alternance')
      else setKind('expertise')

      setTjmMin(r.tjmMin ?? '')
      setTjmMax(r.tjmMax ?? '')
      setTjmWeight(Math.max(1, Math.min(10, Number(r.tjmWeight ?? 1))))

      const isRemote = (r.locationMode || 'REMOTE') === 'REMOTE'
      setRemote(isRemote)
      setRemoteDaysCount(r.remoteDaysCount ?? 1)
      setLocationWeight(Math.max(1, Math.min(10, Number(r.locationWeight ?? 1))))
      if (!isRemote && r.city) {
        setCity({ id: r.city.id, name: r.city.name, country: r.city.countryCode })
      } else {
        setCity(null)
      }

      const rows = Array.isArray(r.technologies) ? r.technologies : []
      if (rows.length) {
        const mapped = rows.map((t) => ({
          technology: t.technology || '',
          level: (t.level || 'JUNIOR').toLowerCase(),
          weight: Math.max(1, Math.min(10, Number.isFinite(t.weight) ? t.weight : 1)),
        }))
        const kindKey =
          r.kind === 'MISSION'
            ? 'mission'
            : r.kind === 'PREEMBAUCHE'
            ? 'preembauche'
            : r.kind === 'ALTERNANCE'
            ? 'alternance'
            : 'expertise'
        setTechRowsByKind((prev) => ({ ...prev, [kindKey]: mapped }))
      }

      setExpertiseObjective(r.expertiseObjective ?? '')
      setExpertiseBudget(r.expertiseBudget ?? '')
      setExpertiseUrgency(r.expertiseUrgency ?? 'moyenne')
      setExpertiseUrgencyWeight(
        Math.max(1, Math.min(10, Number(r.expertiseUrgencyWeight ?? 1))),
      )

      setPrehireJobTitle(r.prehireJobTitle ?? '')
      setPrehireContractType(r.prehireContractType ?? '')
      setPrehireTrialPeriod(r.prehireTrialPeriod ?? '')
      setPrehireCompensation(r.prehireCompensation ?? '')

      setAlternanceJobTitle(r.alternanceJobTitle ?? '')
      setAlternanceDescription(r.alternanceDescription ?? '')
      setAlternanceStudyLevel(r.alternanceStudyLevel ?? '')
      setAlternanceRemuMode(r.alternanceRemuMode ?? 'BAREME')
      setAlternanceRemuAmount(r.alternanceRemuAmount ?? '')
    })().catch(console.error)
  }, [editId])

  const updateRow = (idx, patch) => {
    setTechRowsByKind((prev) => {
      const rows = (prev[kind] || []).map((r, i) => (i === idx ? { ...r, ...patch } : r))
      return { ...prev, [kind]: rows }
    })
  }
  const addRow = () =>
    setTechRowsByKind((prev) => {
      const rows = [...(prev[kind] || []), { technology: '', level: 'junior', weight: 1 }]
      return { ...prev, [kind]: rows }
    })
  const removeRow = (idx) =>
    setTechRowsByKind((prev) => {
      const rows = (prev[kind] || []).filter((_, i) => i !== idx)
      return {
        ...prev,
        [kind]: rows.length ? rows : [{ technology: '', level: 'junior', weight: 1 }],
      }
    })

  // Helper : format jj/mm/aaaa -> jj/mm/aa
  const formatAvail = (s) => {
    if (!s || s === 'oui') return s || 'oui'
    const m = String(s).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
    if (!m) return s
    const dd = m[1].padStart(2, '0')
    const mm = m[2].padStart(2, '0')
    const yy = m[3].slice(-2)
    return `${dd}/${mm}/${yy}`
  }

  // ─── Helpers validation ────────────────────────────────────────────
  const isFilled = (v) => {
    if (typeof v === 'string') return v.trim() !== ''
    if (typeof v === 'number') return !Number.isNaN(v)
    if (typeof v === 'boolean') return true
    if (Array.isArray(v)) return v.length > 0
    if (v && typeof v === 'object') return true
    return false
  }

  /* ── Validation ───────────────────────────────────────────────── */
  const hasAtLeastOneTech = techRows.some((r) => (r.technology || '').trim())
  const techOk = hasAtLeastOneTech &&
    techRows.every((r) => {
      if (!(r.technology || '').trim()) return true
      return isFilled(r.level) && isFilled(String(r.weight))
    })

  // TJM requis uniquement pour "mission"
  const tjmRequired = kind === 'mission'
  const tjmOk = !tjmRequired
    ? true
    : String(tjmMin).trim() !== '' &&
      String(tjmMax).trim() !== '' &&
      Number(tjmMin) >= 0 &&
      Number(tjmMax) >= Number(tjmMin) &&
      isFilled(String(tjmWeight))

  const locationOk = remote
    ? isFilled(String(remoteDaysCount)) &&
      Number(remoteDaysCount) >= 1 &&
      Number(remoteDaysCount) <= 5 &&
      isFilled(String(locationWeight))
    : !!(city && city.name) && isFilled(String(locationWeight))

  const expertiseOk =
    isFilled(expertiseObjective) &&
    String(expertiseBudget).trim() !== '' &&
    Number(expertiseBudget) >= 0 &&
    ['faible', 'moyenne', 'forte'].includes(String(expertiseUrgency)) &&
    isFilled(String(expertiseUrgencyWeight))

  const preembaucheOk =
    isFilled(prehireJobTitle) &&
    isFilled(prehireContractType) &&
    isFilled(prehireTrialPeriod) &&
    isFilled(prehireCompensation)

  const alternanceOk =
    isFilled(alternanceJobTitle) &&
    isFilled(alternanceDescription) &&
    (alternanceRemuMode !== 'SUPERIEURE' || isFilled(alternanceRemuAmount))

  const canSearch =
    kind === 'mission'
      ? tjmOk && locationOk && techOk
      : kind === 'expertise'
      ? techOk && expertiseOk // pas de TJM ni localisation
      : kind === 'preembauche'
      ? locationOk && techOk && preembaucheOk
      : locationOk && techOk && alternanceOk

      /*----------*/
        const resetForm = () => {
    setTjmMin('')
    setTjmMax('')
    setTjmWeight(1)
    setRemote(true)
    setRemoteDaysCount(1)
    setLocationWeight(1)
    setCity(null)
    setTechRowsByKind({
      expertise:   [{ technology: '', level: 'junior', weight: 1 }],
      mission:     [{ technology: '', level: 'junior', weight: 1 }],
      preembauche: [{ technology: '', level: 'junior', weight: 1 }],
      alternance:  [{ technology: '', level: 'junior', weight: 1 }],
    })
    setExpertiseObjective('')
    setExpertiseBudget('')
    setExpertiseUrgency('moyenne')
    setExpertiseUrgencyWeight(1)
    setPrehireJobTitle('')
    setPrehireContractType('')
    setPrehireTrialPeriod('')
    setPrehireCompensation('')
    setAlternanceJobTitle('')
    setAlternanceDescription('')
    setAlternanceStudyLevel('')
    setAlternanceRemuMode('BAREME')
    setAlternanceRemuAmount('')
  }

  /* ── Soumission ───────────────────────────────────────────────── */
  const submit = async (e) => {
    e.preventDefault()
    if (!canSearch || loading) return
    setError('')
    setLoading(true)
    try {
      const technologies = techRows
        .filter((r) => r.technology.trim())
        .map((r) => ({
          technology: r.technology.trim(),
          level: r.level,
          weight: Math.max(0, Math.min(10, Number(r.weight) || 0)),
        }))

      const kindUpper =
        kind === 'mission'
          ? 'MISSION'
          : kind === 'preembauche'
          ? 'PREEMBAUCHE'
          : kind === 'alternance'
          ? 'ALTERNANCE'
          : 'EXPERTISE'

      const payloadBase = {
        kind: kindUpper,
        tjmMin: String(tjmMin).trim() === '' ? null : Number(tjmMin),
        tjmMax: String(tjmMax).trim() === '' ? null : Number(tjmMax),
        tjmWeight: Math.max(0, Math.min(10, Number(tjmWeight) || 0)),
        location: remote
          ? {
              mode: 'remote',
              days: Math.max(1, Math.min(5, Number(remoteDaysCount) || 1)),
              weight: Math.max(0, Math.min(10, Number(locationWeight) || 0)),
            }
          : {
              mode: 'onsite',
              city,
              weight: Math.max(0, Math.min(10, Number(locationWeight) || 0)),
            },
        technologies,
      }

      const payload =
        kindUpper === 'EXPERTISE'
          ? {
              // pas de TJM ni de localisation pour expertise
              kind: kindUpper,
              tjmMin: null,
              tjmMax: null,
              technologies,
              expertiseObjective,
              expertiseBudget:
                String(expertiseBudget).trim() === '' ? null : Number(expertiseBudget),
              expertiseUrgency,
              expertiseUrgencyWeight: Math.max(
                0,
                Math.min(10, Number(expertiseUrgencyWeight) || 0),
              ),
            }
          : kindUpper === 'PREEMBAUCHE'
          ? {
              ...payloadBase,
              prehireJobTitle,
              prehireContractType,
              prehireTrialPeriod,
              prehireCompensation,
            }
          : kindUpper === 'ALTERNANCE'
          ? {
              ...payloadBase,
              alternanceJobTitle,
              alternanceDescription,
              alternanceStudyLevel,
              alternanceRemuMode, // 'BAREME' | 'SUPERIEURE'
              alternanceRemuAmount:
                alternanceRemuMode === 'SUPERIEURE' ? alternanceRemuAmount : null,
            }
          : payloadBase

      const resp = editId
        ? await updateClientRequest(editId, payload)
        : await createClientRequest(payload)

      setSuccessId(resp.id)

    if (!editId) {
      resetForm()
    }

    } catch (err) {
      setError(err?.message || 'Échec de l’enregistrement')
    } finally {
      setLoading(false)
    }
  }

  /* ── Shortlist directe (Cas 2) + sauvegarde recherche ──────────── */
  async function handleComputeShortlist() {
    if (!canSearch) return
    try {
      setLoadingShortlist(true)

      // Requête complète à sauvegarder
      const savedQuery = {
        kind,
        tjmMin,
        tjmMax,
        tjmWeight,
        remote,
        remoteDaysCount,
        locationWeight,
        city,
        techRows,
        expertiseObjective,
        expertiseBudget,
        expertiseUrgency,
        expertiseUrgencyWeight,
        prehireJobTitle,
        prehireContractType,
        prehireTrialPeriod,
        prehireCompensation,
        alternanceJobTitle,
        alternanceDescription,
        alternanceStudyLevel,
        alternanceRemuMode,
        alternanceRemuAmount,
      }

      try {
        const createdSearch = await createClientSavedSearch(savedQuery)
        if (createdSearch && onNewSavedSearch) {
          onNewSavedSearch(createdSearch)
        }
      } catch (e) {
        console.error('Erreur sauvegarde recherche', e)
      }
      const criteria = {
        kind:
          String(kind || 'expertise').toLowerCase() === 'mission'
            ? 'MISSION'
            : String(kind || 'expertise').toLowerCase() === 'preembauche'
            ? 'PREEMBAUCHE'
            : String(kind || 'expertise').toLowerCase() === 'alternance'
            ? 'ALTERNANCE'
            : 'EXPERTISE',

        // Pour EXPERTISE : ignorer localisation + TJM
        cityId: kind === 'expertise' ? null : (city && (city.id || city.value)) || null,
        remote: kind === 'expertise' ? true : remote,
        remoteDaysCount: kind === 'expertise' ? 0 : Number(remoteDaysCount) || 0,
        tjmMin: kind === 'expertise' ? null : tjmMin ? Number(tjmMin) : null,
        tjmMax: kind === 'expertise' ? null : tjmMax ? Number(tjmMax) : null,

        technologies: techRows
          .filter((r) => (r.technology || '').trim())
          .map((r) => ({
            name: String(r.technology).trim().toLowerCase(),
            level: String(r.level || 'intermediate').toLowerCase(),
            weight: Math.max(1, Math.min(10, Number(r.weight) || 1)),
          })),
      }

      const skillImportance = Math.max(
        1,
        ...techRows
          .filter((r) => (r.technology || '').trim())
          .map((r) => Number(r.weight) || 0),
      )

      const derivedWeights = {
        skills: skillImportance,
        tjm: kind === 'expertise' ? 0 : Number(tjmWeight) || 0,
        telework: kind === 'expertise' ? 0 : Number(locationWeight) || 0,
        availability: 0,
      }

      setLastWeights(derivedWeights)
      const res = await computeShortlist({ criteria, weights: derivedWeights })
      setShortlistByKind((prev) => ({ ...prev, [kind]: res || [] }))
    } catch {
      setShortlistByKind((prev) => ({ ...prev, [kind]: [] }))
    } finally {
      setLoadingShortlist(false)
    }
  }

  const locationLabel = remote ? 'télétravail' : 'localisation'

  // ─── Helpers affichage shortlist ───────────────────────────────────
  const getSkillsTotal = (r) => {
    if (!r?.details) return 0
    if (typeof r.details.skills === 'object') return r.details.skills?.total ?? 0
    return r.details.skills ?? 0
  }
  const getPerTech = (r) =>
    typeof r?.details?.skills === 'object' ? r.details.skills.details || [] : []
  const getMismatches = (r) => getPerTech(r).filter((d) => (d.match ?? 0) < 100)

  /* ── UI ────────────────────────────────────────────────────────── */
  return (
    <section>
      <form onSubmit={submit} className="space-y-8">
        {/* Type de besoin */}
        <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-2xl font-bold text-gray-800">
            Vous cherchez
          </label>

          <button
            type="button"
            onClick={resetForm}
            className="text-sm text-gray-500 underline hover:text-gray-700"
          >
            Effacer tous les champs
          </button>
        </div>
          <div className="flex flex-wrap items-center gap-6">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                value="mission"
                checked={kind === 'mission'}
                onChange={() => setKind('mission')}
              />
              <span>une mission</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                value="expertise"
                checked={kind === 'expertise'}
                onChange={() => setKind('expertise')}
              />
              <span>une expertise</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                value="preembauche"
                checked={kind === 'preembauche'}
                onChange={() => setKind('preembauche')}
              />
              <span>pré-embauche</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                value="alternance"
                checked={kind === 'alternance'}
                onChange={() => setKind('alternance')}
              />
              <span>alternance</span>
            </label>
          </div>
        </div>

        {/* Expertise */}
        {kind === 'expertise' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Objectif</label>
              <textarea
                className="mt-1 w-full rounded-md border px-3 py-2"
                rows={4}
                placeholder="ex : audit, formation, validation d’architecture…"
                value={expertiseObjective}
                onChange={(e) => setExpertiseObjective(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Enveloppe prévue (€)</label>
              <input
                type="number"
                min="0"
                className="mt-1 w-full rounded-md border px-3 py-2"
                placeholder="ex : 3 000"
                value={expertiseBudget}
                onChange={(e) => setExpertiseBudget(e.target.value)}
              />
            </div>

            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs text-gray-600 mb-1">Urgence</span>
                  <select
                    className="w-full rounded-md border px-3 py-2 bg-white"
                    value={expertiseUrgency}
                    onChange={(e) => setExpertiseUrgency(e.target.value)}
                  >
                    <option value="faible">Faible</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="forte">Forte</option>
                  </select>
                </div>
                <div>
                  <span className="block text-xs text-gray-600 mb-1">Importance /10</span>
                  <select
                    className="w-full rounded-md border px-3 py-2 bg-white"
                    value={expertiseUrgencyWeight}
                    onChange={(e) => setExpertiseUrgencyWeight(Number(e.target.value))}
                  >
                    {importanceOptions.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pré-embauche */}
        {kind === 'preembauche' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Intitulé du poste</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={prehireJobTitle}
                onChange={(e) => setPrehireJobTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Type de contrat</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                placeholder="ex: CDI / CDD "
                value={prehireContractType}
                onChange={(e) => setPrehireContractType(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Période d’essai souhaitée</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                placeholder="ex : 1 mois, 3 mois"
                value={prehireTrialPeriod}
                onChange={(e) => setPrehireTrialPeriod(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Rémunération envisagée</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                placeholder="ex : 38–45k"
                value={prehireCompensation}
                onChange={(e) => setPrehireCompensation(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Alternance */}
        {kind === 'alternance' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Intitulé du poste</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={alternanceJobTitle}
                onChange={(e) => setAlternanceJobTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Descriptif alternance</label>
              <textarea
                className="mt-1 w-full rounded-md border px-3 py-2"
                rows={4}
                placeholder="Missions, rythme, école cible, etc."
                value={alternanceDescription}
                onChange={(e) => setAlternanceDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Niveau d’études actuel</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                placeholder="ex : Bac+1, BUT2, Licence, M1..."
                value={alternanceStudyLevel}
                onChange={(e) => setAlternanceStudyLevel(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Rémunération</label>
              <div className="flex flex-wrap items-center gap-6">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="altRemu"
                    checked={alternanceRemuMode === 'BAREME'}
                    onChange={() => setAlternanceRemuMode('BAREME')}
                  />
                  <span>selon barème</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="altRemu"
                    checked={alternanceRemuMode === 'SUPERIEURE'}
                    onChange={() => setAlternanceRemuMode('SUPERIEURE')}
                  />
                  <span>supérieure</span>
                </label>
              </div>
              {alternanceRemuMode === 'SUPERIEURE' && (
                <div className="mt-3 bg-gray-100 rounded-md p-3">
                  <label className="block text-xs text-gray-600 mb-1">
                    rémunération annuelle brute
                  </label>
                  <input
                    className="w-full rounded-md border px-3 py-2 bg-white"
                    placeholder="ex : 22 000 €"
                    value={alternanceRemuAmount}
                    onChange={(e) => setAlternanceRemuAmount(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TJM fourchette + importance (mission uniquement) */}
        {kind === 'mission' && (
          <div>
            <label className="block text-2xl font-bold text-gray-800 mb-4">
              TJM souhaité
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="block text-xs text-gray-600 mb-1">Min (€)</span>
                <input
                  type="number"
                  min="0"
                  value={tjmMin}
                  onChange={(e) => setTjmMin(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2"
                />
              </div>
              <div>
                <span className="block text-xs text-gray-600 mb-1">Max (€)</span>
                <input
                  type="number"
                  min="0"
                  value={tjmMax}
                  onChange={(e) => setTjmMax(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2"
                />
              </div>
              <div>
                <span className="block text-xs text-gray-600 mb-1">Importance /10</span>
                <select
                  className="w-full rounded-xl border px-3 py-2 bg-white"
                  value={tjmWeight}
                  onChange={(e) => setTjmWeight(Number(e.target.value))}
                >
                  {importanceOptions.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {!tjmOk && (
              <div className="mt-1 text-sm text-red-600">Min/Max incohérents.</div>
            )}
          </div>
        )}

        {/* Localisation (masqué pour expertise) */}
        {kind !== 'expertise' && (
          <div className="space-y-3">
            <label className="block text-2xl font-bold text-gray-800 mb-4">
              Localisation
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={remote}
                onChange={(e) => setRemote(e.target.checked)}
              />
              <span>Télétravail</span>
            </label>
            {remote ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="block text-xs text-gray-600 mb-1">
                    Jours TT (1–5)
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={remoteDaysCount}
                    onChange={(e) => setRemoteDaysCount(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2"
                  />
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-xs text-gray-600">Importance /10</span>
                  <select
                    className="w-full rounded-xl border px-3 py-2 bg-white"
                    value={locationWeight}
                    onChange={(e) => setLocationWeight(Number(e.target.value))}
                  >
                    {importanceOptions.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CitySelect value={city} onChange={setCity} />
                <div>
                  <span className="block text-xs text-gray-600 mb-1">
                    Importance /10
                  </span>
                  <select
                    className="w-full rounded-xl border px-3 py-2 bg-white"
                    value={locationWeight}
                    onChange={(e) => setLocationWeight(Number(e.target.value))}
                  >
                    {importanceOptions.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Technologies */}
        <div>
          <div className="mb-3">
            <label className="block text-2xl font-bold text-gray-800 mb-4">
              Technologies requises
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-xl overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Technologie
                  </th>
                  <th className="px-3 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Niveau
                  </th>
                  <th className="px-3 py-2 border-b text-left text-sm font-medium text-gray-700">
                    Importance /10
                  </th>
                  <th className="px-3 py-2 border-b" />
                </tr>
              </thead>
              <tbody>
                {techRows.map((row, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={row.technology}
                        onChange={(e) =>
                          updateRow(idx, { technology: e.target.value })
                        }
                        className="w-full rounded-lg border px-3 py-2"
                        placeholder="Ex: React, Java…"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={row.level}
                        onChange={(e) => updateRow(idx, { level: e.target.value })}
                        className="w-full rounded-lg border px-3 py-2 bg-white"
                      >
                        <option value="beginner">Débutant</option>
                        <option value="junior">Junior</option>
                        <option value="intermediate">Intermédiaire</option>
                        <option value="senior">Senior</option>
                        <option value="expert">Expert</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <select
                        className="w-full rounded-lg border px-3 py-2 bg-white"
                        value={row.weight}
                        onChange={(e) =>
                          updateRow(idx, { weight: Number(e.target.value) })
                        }
                      >
                        {importanceOptions.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => removeRow(idx)}
                        className="text-sm text-red-600 hover:underline"
                        disabled={techRows.length === 1}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3">
            <button
              type="button"
              onClick={addRow}
              className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Ajouter une ligne
            </button>
          </div>

          {!hasAtLeastOneTech && (
            <div className="mt-2 text-sm text-red-600">
              Ajoutez au moins une technologie.
            </div>
          )}
        </div>

      {/* Actions */}
      <div className="pt-4 flex flex-col items-center gap-2">
        {showValidationMsg && !canSearch && (
          <p className="w-3/4 max-w-3xl mx-auto mb-2 text-sm text-red-600 text-center">
            Remplissez tous les champs de l’onglet pour lancer la recherche.
          </p>
        )}
        <button
          type="button"
          onClick={onClickShortlist}
          disabled={loadingShortlist}
          className={cx(
            "w-3/4 max-w-3xl inline-flex items-center justify-center rounded-2xl px-6 py-3 font-semibold text-base md:text-lg shadow-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8EBDFC] focus-visible:ring-offset-1 disabled:opacity-60",
            canSearch
              ? "bg-[#7CB2F7] hover:bg-[#6AA4F3] active:bg-[#5C99E8] text-black border-[#5C99E8]/60"
              : "bg-[#CBE0FF] text-[#5B6B8A] border-[#8EBDFC]/40"
          )}
        >
          {loadingShortlist ? 'Calcul…' : 'Voir la shortlist'}
        </button>
      </div>

        <div className="mx-auto my-6 h-[1px] w-3/4 max-w-3xl bg-[#8EBDFC]/40" />

        {/* Messages */}
        {successId && (
          <div className="text-green-700">
            Demande enregistrée. ID&nbsp;:{' '}
            <span className="font-semibold">{successId}</span>
          </div>
        )}
        {error && <div className="text-red-600">{error}</div>}

        {/* Résultat shortlist */}
        {!loadingShortlist && (shortlist?.length > 0) && (
          <div ref={shortlistRef} className="mt-6">
            <h3 className="text-2xl md:text-3xl font-semibold text-center text-[#8EBDFC] mb-2">
              Top 10
            </h3>
            <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-[#8EBDFC]" />

            {/* Filtrer: masquer profils avec skills à 0% */}
            <div className="space-y-3">
              {shortlist
                .filter((r) => getSkillsTotal(r) > 0)
                .map((r) => {
                  const skillsTotal = getSkillsTotal(r)
                  const perTech = getPerTech(r)
                  const mismatches = perTech.filter((d) => (d.match ?? 0) < 100)
                  const availRaw = r?.details?.availabilityText || 'oui'
                  const availText = formatAvail(availRaw)
                  const skillsPct = Number(r?.details?.skills?.total ?? 0)
                  const tjmPct = Number(r?.details?.tjm ?? 0)
                  const telePct = Number(r?.details?.telework ?? 0)
                  const skillsWeight =
                    Number(r?.details?.skills?.weight ?? lastWeights?.skills ?? 0)

                  const hasFutureDate = availText !== 'oui'

                  const totalW =
                    skillsWeight +
                    (Number(lastWeights?.tjm) || 0) +
                    (Number(lastWeights?.telework) || 0)

                  const scoreNum =
                    totalW > 0
                      ? (((skillsPct / 100) * skillsWeight +
                          (tjmPct / 100) * (lastWeights?.tjm || 0) +
                          (telePct / 100) * (lastWeights?.telework || 0)) /
                          totalW) *
                        100
                      : 0
                  return (
                    <div
                      key={r.userId}
                      className="rounded-2xl border border-[#8EBDFC]/30 bg-white shadow-sm p-4"
                    >
                      {/* En-tête : bandeau gradient avec profil + scores */}
                      <div className="rounded-xl bg-gradient-to-r from-[#F5FAFF] to-[#ECF3FF] border border-[#8EBDFC]/40 px-4 py-2 flex items-center justify-between gap-1 flex-nowrap">
                        <div>
                          <div className="text-xs text-gray-500">Profil</div>
                          <div className="text-lg font-semibold">
                            {r.fullName || `ID ${r.userId}`}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 whitespace-nowrap flex-nowrap overflow-x-auto">
                          <span className="inline-flex items-center rounded-full border border-[#8EBDFC] bg-[#8EBDFC]/10 px-3 py-1 text-sm font-semibold text-blue-700">
                            score {Math.round(scoreNum)}%
                          </span>

                          <span className="h-6 w-px bg-[#8EBDFC]/30 mx-1 hidden sm:block" />

                          <span className="inline-flex items-center rounded-full bg-[#EAF2FF] text-blue-800 px-3 py-1 text-sm">
                            skills {skillsTotal ?? 0}%
                          </span>
                          <span className="inline-flex items-center rounded-full bg-[#EAF2FF] text-blue-800 px-3 py-1 text-sm">
                            tjm {r.details?.tjm ?? 0}%
                          </span>
                          <span className="inline-flex items-center rounded-full bg-[#EAF2FF] text-blue-800 px-3 py-1 text-sm">
                            {locationLabel} {r.details?.telework ?? 0}%
                          </span>

                          <span className="h-6 w-px bg-[#8EBDFC]/30 mx-1 hidden sm:block" />

                          {hasFutureDate ? (
                            <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold bg-orange-100 text-orange-800">
                              dispo {availText}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold bg-green-100 text-green-800">
                              disponible
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Tableau récapitulatif : une ligne par techno + TJM + TT */}
                      <div className="mt-4">
                        {(() => {
                          // --- Données demandées (attendu) ---
                          const reqTechList = techRows
                            .filter((t) => (t.technology || '').trim())
                            .map((t) => ({
                              name: t.technology.trim(),
                              level: levelLabel(t.level),
                              weight: Number(t.weight) || 0,
                            }))

                          const expectedTjm =
                            kind === 'expertise'
                              ? '—'
                              : String(tjmMin).trim() !== '' ||
                                String(tjmMax).trim() !== ''
                              ? `${String(tjmMin).trim() || '…'}–${
                                  String(tjmMax).trim() || '…'
                                } €`
                              : '—'

                          const expectedTT =
                            kind === 'expertise'
                              ? '—'
                              : remote
                              ? `${remoteDaysCount || 0} j/s`
                              : city?.name || '—'

                          // --- Données profil (résultat) ---
                          const perTech = getPerTech(r)
                          const perTechMap = new Map(
                            perTech.map((d) => [
                              String(d.techName || '').toLowerCase(),
                              d,
                            ]),
                          )
                          const profileTjm =
                            r.details?.tjmMin && r.details?.tjmMax
                              ? `${r.details.tjmMin}–${r.details.tjmMax} €`
                              : r.details?.tjmValue
                              ? `${r.details.tjmValue} €`
                              : '—'
                          const profileTT = r.details?.teleworkDays
                            ? `${r.details.teleworkDays} j/s`
                            : '0 j/s'

                          // --- Importances (côté client) ---
                          const tjmImportance =
                            kind === 'expertise' ? 0 : Number(tjmWeight) || 0
                          const locImportance =
                            kind === 'expertise' ? 0 : Number(locationWeight) || 0

                          return (
                            <>
                              <div className="overflow-x-auto rounded-xl border border-gray-200">
                                <table className="min-w-full text-sm">
                                  <thead className="bg-gray-50 text-gray-700">
                                    <tr>
                                      <th className="px-3 py-2 text-left font-semibold w-40">
                                        Critère
                                      </th>
                                      <th className="px-3 py-2 text-left font-semibold">
                                        Attendu
                                      </th>
                                      <th className="px-3 py-2 text-left font-semibold">
                                        Profil
                                      </th>
                                      <th className="px-3 py-2 text-left font-semibold w-28">
                                        Importance
                                      </th>
                                      <th className="px-3 py-2 text-right font-semibold w-28">
                                        Match
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {reqTechList.length > 0 ? (
                                      reqTechList.map((t, idx) => {
                                        const found = perTechMap.get(
                                          t.name.toLowerCase(),
                                        )
                                        const profileLevel = found?.profileLevel
                                          ? levelLabel(found.profileLevel)
                                          : '—'
                                        const match = Math.max(
                                          0,
                                          Math.min(100, found?.match ?? 0),
                                        )
                                        const critCell =
                                          idx === 0 ? (
                                            <td
                                              className="px-3 py-2 font-semibold align-top"
                                              rowSpan={reqTechList.length}
                                            >
                                              Technologies
                                            </td>
                                          ) : null
                                        return (
                                          <tr
                                            key={`${t.name}-${idx}`}
                                            className={idx === 0 ? 'border-t' : ''}
                                          >
                                            {critCell}
                                            <td className="px-3 py-2">
                                              {t.name} ({t.level})
                                            </td>
                                            <td className="px-3 py-2">
                                              {t.name} ({profileLevel})
                                            </td>
                                            <td className="px-3 py-2 tabular-nums">
                                              {t.weight}
                                            </td>
                                            <td className="px-3 py-2 text-right tabular-nums">
                                              {match}%
                                            </td>
                                          </tr>
                                        )
                                      })
                                    ) : (
                                      <tr className="border-t">
                                        <td className="px-3 py-2 font-semibold">
                                          Technologies
                                        </td>
                                        <td className="px-3 py-2">—</td>
                                        <td className="px-3 py-2">—</td>
                                        <td className="px-3 py-2 tabular-nums">
                                          0
                                        </td>
                                        <td className="px-3 py-2 text-right tabular-nums">
                                          {getSkillsTotal(r) ?? 0}%
                                        </td>
                                      </tr>
                                    )}

                                    <tr className="border-t">
                                      <td className="px-3 py-2 font-semibold">
                                        TJM
                                      </td>
                                      <td className="px-3 py-2">{expectedTjm}</td>
                                      <td className="px-3 py-2">{profileTjm}</td>
                                      <td className="px-3 py-2 tabular-nums">
                                        {tjmImportance}
                                      </td>
                                      <td className="px-3 py-2 text-right tabular-nums">
                                        {r.details?.tjm ?? 0}%
                                      </td>
                                    </tr>

                                    <tr className="border-t">
                                      <td className="px-3 py-2 font-semibold">
                                        Télétravail
                                      </td>
                                      <td className="px-3 py-2">{expectedTT}</td>
                                      <td className="px-3 py-2">{profileTT}</td>
                                      <td className="px-3 py-2 tabular-nums">
                                        {locImportance}
                                      </td>
                                      <td className="px-3 py-2 text-right tabular-nums">
                                        {r.details?.telework ?? 0}%
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>

                              <ShortlistDebug
                                result={r}
                                weights={lastWeights}
                                reqTechs={techRows}
                              />
                            </>
                          )
                        })()}
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        )}
      </form>
    </section>
  )
}