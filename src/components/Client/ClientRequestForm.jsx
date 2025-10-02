import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import cx from 'classnames'
import CitySelect from './CitySelect'
import { createClientRequest } from '../../api'
import { getClientRequest, updateClientRequest } from '../../api/clientRequests'
import { computeShortlist } from '../../api/shortlist'

export default function ClientRequestForm() {
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')

  /* ── Choix simples ──────────────────────────────────────────────── */
  const [kind, setKind] = useState('mission') // expertise | mission | preembauche | alternance

  // TJM
  const [tjmMin, setTjmMin] = useState('')
  const [tjmMax, setTjmMax] = useState('')
  const [tjmWeight, setTjmWeight] = useState(0)

  // Localisation
  const [remote, setRemote] = useState(true)
  const [remoteDaysCount, setRemoteDaysCount] = useState(1)
  const [locationWeight, setLocationWeight] = useState(0)
  const [city, setCity] = useState(null)

// Technologies (par onglet)
const [techRowsByKind, setTechRowsByKind] = useState({
  expertise:   [{ technology: '', level: 'junior', weight: 1 }],
  mission:     [{ technology: '', level: 'junior', weight: 1 }],
  preembauche: [{ technology: '', level: 'junior', weight: 1 }],
  alternance:  [{ technology: '', level: 'junior', weight: 1 }],
})
const techRows = techRowsByKind[kind] || techRowsByKind.expertise

  // Expertise
  const [expertiseObjective, setExpertiseObjective] = useState('')
  const [expertiseDuration, setExpertiseDuration] = useState('')

  // Pré-embauche
  const [prehireJobTitle, setPrehireJobTitle] = useState('')
  const [prehireContractType, setPrehireContractType] = useState('')
  const [prehireTrialPeriod, setPrehireTrialPeriod] = useState('')
  const [prehireCompensation, setPrehireCompensation] = useState('')

  // Alternance
  const [alternanceJobTitle, setAlternanceJobTitle] = useState('')
  const [alternanceDescription, setAlternanceDescription] = useState('')
  const [alternanceRemuMode, setAlternanceRemuMode] = useState('BAREME') // BAREME | SUPERIEURE
  const [alternanceRemuAmount, setAlternanceRemuAmount] = useState('')

  // UI
  const [loading, setLoading] = useState(false)
  const [successId, setSuccessId] = useState(null)
  const [error, setError] = useState('')
  const [showValidationMsg, setShowValidationMsg] = useState(false)

  // Shortlist (Cas 2 direct)
const [shortlistByKind, setShortlistByKind] = useState({
  expertise: [], mission: [], preembauche: [], alternance: []
})
const shortlist = shortlistByKind[kind] || []
  const [loadingShortlist, setLoadingShortlist] = useState(false)
  const [weights, setWeights] = useState({ skills: 5, tjm: 3, location: 2, availability: 2 })

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
      setTjmWeight(r.tjmWeight ?? 0)

      const isRemote = (r.locationMode || 'REMOTE') === 'REMOTE'
      setRemote(isRemote)
      setRemoteDaysCount(r.remoteDaysCount ?? 1)
      setLocationWeight(r.locationWeight ?? 0)
      if (!isRemote && r.city) {
        setCity({ id: r.city.id, name: r.city.name, country: r.city.countryCode })
      } else {
        setCity(null)
      }

      const rows = Array.isArray(r.technologies) ? r.technologies : []
if (rows.length) {
  const mapped = rows.map(t => ({
    technology: t.technology || '',
    level: (t.level || 'JUNIOR').toLowerCase(),
    weight: Number.isFinite(t.weight) ? t.weight : 1,
  }))
  const kindKey =
    r.kind === 'MISSION' ? 'mission' :
    r.kind === 'PREEMBAUCHE' ? 'preembauche' :
    r.kind === 'ALTERNANCE' ? 'alternance' : 'expertise'
  setTechRowsByKind(prev => ({ ...prev, [kindKey]: mapped }))
}


      setExpertiseObjective(r.expertiseObjective ?? '')
      setExpertiseDuration(r.expertiseDuration ?? '')

      setPrehireJobTitle(r.prehireJobTitle ?? '')
      setPrehireContractType(r.prehireContractType ?? '')
      setPrehireTrialPeriod(r.prehireTrialPeriod ?? '')
      setPrehireCompensation(r.prehireCompensation ?? '')

      setAlternanceJobTitle(r.alternanceJobTitle ?? '')
      setAlternanceDescription(r.alternanceDescription ?? '')
      setAlternanceRemuMode(r.alternanceRemuMode ?? 'BAREME')
      setAlternanceRemuAmount(r.alternanceRemuAmount ?? '')
    })().catch(console.error)
  }, [editId])

const updateRow = (idx, patch) => {
  setTechRowsByKind(prev => {
    const rows = (prev[kind] || []).map((r, i) => (i === idx ? { ...r, ...patch } : r))
    return { ...prev, [kind]: rows }
  })
}
const addRow = () => setTechRowsByKind(prev => {
  const rows = [...(prev[kind] || []), { technology: '', level: 'junior', weight: 1 }]
  return { ...prev, [kind]: rows }
})
const removeRow = idx => setTechRowsByKind(prev => {
  const rows = (prev[kind] || []).filter((_, i) => i !== idx)
  return { ...prev, [kind]: rows.length ? rows : [{ technology: '', level: 'junior', weight: 1 }] }
})

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
const hasAtLeastOneTech = techRows.some(r => (r.technology || '').trim())
const techOk = hasAtLeastOneTech && techRows.every(r => {
  if (!(r.technology || '').trim()) return true
  return isFilled(r.level) && isFilled(String(r.weight))
})

const tjmRequired = kind === 'mission' || kind === 'expertise'
const tjmOk = !tjmRequired
  ? true
  : (
      String(tjmMin).trim() !== '' &&
      String(tjmMax).trim() !== '' &&
      Number(tjmMin) >= 0 &&
      Number(tjmMax) >= Number(tjmMin) &&
      isFilled(String(tjmWeight))
    )

const locationOk = remote
  ? (
      isFilled(String(remoteDaysCount)) &&
      Number(remoteDaysCount) >= 1 &&
      Number(remoteDaysCount) <= 5 &&
      isFilled(String(locationWeight))
    )
  : (
      !!(city && city.name) &&
      isFilled(String(locationWeight))
    )

const expertiseOk =
  isFilled(expertiseObjective) &&
  isFilled(expertiseDuration)

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
    ? (tjmOk && locationOk && techOk)
    : kind === 'expertise'
    ? (tjmOk && locationOk && techOk && expertiseOk)
    : kind === 'preembauche'
    ? (locationOk && techOk && preembaucheOk)
    : (locationOk && techOk && alternanceOk) // alternance

  /* ── Soumission ───────────────────────────────────────────────── */
  const submit = async e => {
    e.preventDefault()
    if (!canSubmit || loading) return
    setError('')
    setLoading(true)
    try {
      const technologies = techRows
        .filter(r => r.technology.trim())
        .map(r => ({
          technology: r.technology.trim(),
          level: r.level,
          weight: Math.max(0, Math.min(10, Number(r.weight) || 0)),
        }))

      const kindUpper =
        kind === 'mission' ? 'MISSION'
        : kind === 'preembauche' ? 'PREEMBAUCHE'
        : kind === 'alternance' ? 'ALTERNANCE'
        : 'EXPERTISE'

      const payloadBase = {
        kind: kindUpper,
        tjmMin: String(tjmMin).trim() === '' ? null : Number(tjmMin),
        tjmMax: String(tjmMax).trim() === '' ? null : Number(tjmMax),
        tjmWeight: Math.max(0, Math.min(10, Number(tjmWeight) || 0)),
        location: remote
          ? { mode: 'remote', days: Math.max(1, Math.min(5, Number(remoteDaysCount) || 1)), weight: Math.max(0, Math.min(10, Number(locationWeight) || 0)) }
          : { mode: 'onsite', city, weight: Math.max(0, Math.min(10, Number(locationWeight) || 0)) },
        technologies,
      }

      const payload =
        kindUpper === 'EXPERTISE'
          ? {
              ...payloadBase,
              expertiseObjective,
              expertiseDuration,
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
              alternanceRemuMode, // 'BAREME' | 'SUPERIEURE'
              alternanceRemuAmount: alternanceRemuMode === 'SUPERIEURE' ? alternanceRemuAmount : null,
            }
          : payloadBase

      const resp = editId
        ? await updateClientRequest(editId, payload)
        : await createClientRequest(payload)

      setSuccessId(resp.id)

      if (!editId) {
        setTjmMin('')
        setTjmMax('')
        setTjmWeight(0)
        setRemote(true)
        setRemoteDaysCount(1)
        setLocationWeight(0)
        setCity(null)
setTechRowsByKind({
  expertise:   [{ technology: '', level: 'junior', weight: 1 }],
  mission:     [{ technology: '', level: 'junior', weight: 1 }],
  preembauche: [{ technology: '', level: 'junior', weight: 1 }],
  alternance:  [{ technology: '', level: 'junior', weight: 1 }],
})
        setExpertiseObjective('')
        setExpertiseDuration('')
        setPrehireJobTitle('')
        setPrehireContractType('')
        setPrehireTrialPeriod('')
        setPrehireCompensation('')
        setAlternanceJobTitle('')
        setAlternanceDescription('')
        setAlternanceRemuMode('BAREME')
        setAlternanceRemuAmount('')
      }
    } catch (err) {
      setError(err?.message || 'Échec de l’enregistrement')
    } finally {
      setLoading(false)
    }
  }

  /* ── Shortlist directe (Cas 2) ─────────────────────────────────── */
  async function handleComputeShortlist() {
    if (!canSearch) return
    try {
      setLoadingShortlist(true)
const criteria = {
  kind:
    String(kind || 'expertise').toLowerCase() === 'mission'
      ? 'MISSION'
      : String(kind || 'expertise').toLowerCase() === 'preembauche'
      ? 'PREEMBAUCHE'
      : 'EXPERTISE',
  cityId: (city && (city.id || city.value)) || null,
  remote,
  remoteDaysCount: Number(remoteDaysCount) || 0,
  tjmMin: tjmMin ? Number(tjmMin) : null,
  tjmMax: tjmMax ? Number(tjmMax) : null,

technologies: techRows
  .filter(r => (r.technology || '').trim())
  .map(r => ({
    name: String(r.technology).trim().toLowerCase(),
    level: String(r.level || 'medium').toLowerCase(),
    weight: Math.max(1, Math.min(10, Number(r.weight) || 1)),
  })),

}

const skillImportance = Math.max(
  1,
  ...techRows.filter(r => (r.technology || '').trim()).map(r => Number(r.weight) || 0)
)

const derivedWeights = {
  skills: skillImportance,
  tjm: Number(tjmWeight) || 0,
  location: Number(locationWeight) || 0,
  availability: Number(weights.availability) || 0,
}
const res = await computeShortlist({ criteria, weights: derivedWeights })

setShortlistByKind(prev => ({ ...prev, [kind]: res || [] }))
    } catch {
      setShortlist([])
    } finally {
      setLoadingShortlist(false)
    }
  }
  const locationLabel = remote ? 'télétravail' : 'localisation'

  // ─── Click shortlist avec validation visible ───────────────────────
const onClickShortlist = () => {
  if (!canSearch) {
    setShowValidationMsg(true)
    return
  }
  setShowValidationMsg(false)
  handleComputeShortlist()
}


  /* ── UI ────────────────────────────────────────────────────────── */
  return (
    <section>
      <form onSubmit={submit} className="space-y-8">
        {/* Type de besoin */}
        <div>
          <label className="block text-2xl font-bold text-gray-800 mb-4">
            Vous cherchez
          </label>
          <div className="flex flex-wrap items-center gap-6">
                        <label className="inline-flex items-center gap-2">
              <input type="radio" value="mission" checked={kind==='mission'} onChange={()=>setKind('mission')} />
              <span>une mission</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" value="expertise" checked={kind==='expertise'} onChange={()=>setKind('expertise')} />
              <span>une expertise</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" value="preembauche" checked={kind==='preembauche'} onChange={()=>setKind('preembauche')} />
              <span>pré-embauche</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" value="alternance" checked={kind==='alternance'} onChange={()=>setKind('alternance')} />
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
                onChange={e => setExpertiseObjective(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Durée estimée</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  min="1"
                  className="mt-1 w-1/2 rounded-md border px-3 py-2"
                  placeholder="ex : 3"
                  value={expertiseDuration?.split(' ')[0] || ''}
                  onChange={e => {
                    const unit = expertiseDuration?.split(' ')[1] || 'jours'
                    setExpertiseDuration(`${e.target.value} ${unit}`)
                  }}
                />
                <select
                  className="mt-1 w-1/2 rounded-md border px-3 py-2 bg-white"
                  value={expertiseDuration?.split(' ')[1] || 'jours'}
                  onChange={e => {
                    const val = expertiseDuration?.split(' ')[0] || ''
                    setExpertiseDuration(`${val} ${e.target.value}`)
                  }}
                >
                  <option value="jours">jours</option>
                  <option value="semaines">semaines</option>
                  <option value="mois">mois</option>
                  <option value="années">années</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Pré-embauche */}
        {kind === 'preembauche' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Intitulé du poste</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2" value={prehireJobTitle} onChange={e=>setPrehireJobTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium">Type de contrat</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2" placeholder="ex: CDI / CDD " value={prehireContractType} onChange={e=>setPrehireContractType(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium">Période d’essai souhaitée</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2" placeholder="ex : 1 mois, 3 mois" value={prehireTrialPeriod} onChange={e=>setPrehireTrialPeriod(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium">Rémunération envisagée</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2" placeholder="ex : 38–45k" value={prehireCompensation} onChange={e=>setPrehireCompensation(e.target.value)} />
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
                onChange={e=>setAlternanceJobTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Descriptif alternance</label>
              <textarea
                className="mt-1 w-full rounded-md border px-3 py-2"
                rows={4}
                placeholder="Missions, rythme, école cible, etc."
                value={alternanceDescription}
                onChange={e=>setAlternanceDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rémunération</label>
              <div className="flex flex-wrap items-center gap-6">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="altRemu"
                    checked={alternanceRemuMode==='BAREME'}
                    onChange={()=>setAlternanceRemuMode('BAREME')}
                  />
                  <span>selon barème</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="altRemu"
                    checked={alternanceRemuMode==='SUPERIEURE'}
                    onChange={()=>setAlternanceRemuMode('SUPERIEURE')}
                  />
                  <span>supérieure</span>
                </label>
              </div>
              {alternanceRemuMode==='SUPERIEURE' && (
                <div className="mt-3 bg-gray-100 rounded-md p-3">
                  <label className="block text-xs text-gray-600 mb-1">rémunération annuelle brute</label>
                  <input
                    className="w-full rounded-md border px-3 py-2 bg-white"
                    placeholder="ex : 22 000 €"
                    value={alternanceRemuAmount}
                    onChange={e=>setAlternanceRemuAmount(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TJM fourchette + importance (affiché sauf pour pré-embauche/alternance) */}
        {kind !== 'preembauche' && kind !== 'alternance' && (
          <div>
            <label className="block text-2xl font-bold text-gray-800 mb-4">
              TJM souhaité
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="block text-xs text-gray-600 mb-1">Min (€)</span>
                <input type="number" min="0" value={tjmMin} onChange={e=>setTjmMin(e.target.value)} className="w-full rounded-xl border px-3 py-2" />
              </div>
              <div>
                <span className="block text-xs text-gray-600 mb-1">Max (€)</span>
                <input type="number" min="0" value={tjmMax} onChange={e=>setTjmMax(e.target.value)} className="w-full rounded-xl border px-3 py-2" />
              </div>
              <div>
                <span className="block text-xs text-gray-600 mb-1">Importance /10</span>
                <input type="number" min="1" max="10" value={tjmWeight} onChange={e=>setTjmWeight(e.target.value)} className="w-full rounded-xl border px-3 py-2" />
              </div>
            </div>
            {!tjmOk && <div className="mt-1 text-sm text-red-600">Min/Max incohérents.</div>}
          </div>
        )}

        {/* Localisation */}
        <div className="space-y-3">
          <label className="block text-2xl font-bold text-gray-800 mb-4">Localisation</label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={remote} onChange={e=>setRemote(e.target.checked)} />
            <span>Télétravail</span>
          </label>
          {remote ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="block text-xs text-gray-600 mb-1">Jours TT (1–5)</span>
                <input type="number" min="1" max="5" value={remoteDaysCount} onChange={e=>setRemoteDaysCount(e.target.value)} className="w-full rounded-xl border px-3 py-2" />
              </div>
              <div className="sm:col-span-2">
                <span className="block text-xs text-gray-600">Importance /10</span>
                <input type="number" min="0" max="10" value={locationWeight} onChange={e=>setLocationWeight(e.target.value)} className="w-full rounded-xl border px-3 py-2" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CitySelect value={city} onChange={setCity} />
              <div>
                <span className="block text-xs text-gray-600 mb-1">Importance /10</span>
                <input type="number" min="0" max="10" value={locationWeight} onChange={e=>setLocationWeight(e.target.value)} className="w-full rounded-xl border px-3 py-2" />
              </div>
            </div>
          )}
        </div>

        {/* Technologies */}
        <div>
          <div className="mb-3">
            <label className="block text-2xl font-bold text-gray-800 mb-4">Technologies requises</label>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-xl overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 border-b text-left text-sm font-medium text-gray-700">Technologie</th>
                  <th className="px-3 py-2 border-b text-left text-sm font-medium text-gray-700">Niveau</th>
                  <th className="px-3 py-2 border-b text-left text-sm font-medium text-gray-700">Importance /10</th>
                  <th className="px-3 py-2 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {techRows.map((row, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-3 py-2">
                      <input type="text" value={row.technology} onChange={e=>updateRow(idx,{technology:e.target.value})} className="w-full rounded-lg border px-3 py-2" placeholder="Ex: React, Java…" />
                    </td>
                    <td className="px-3 py-2">
                      <select value={row.level} onChange={e=>updateRow(idx,{level:e.target.value})} className="w-full rounded-lg border px-3 py-2 bg-white">
                        <option value="junior">Junior</option>
                        <option value="medium">Medium</option>
                        <option value="expert">Expert</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input type="number" min="0" max="10" value={row.weight} onChange={e=>updateRow(idx,{weight:e.target.value})} className="w-full rounded-lg border px-3 py-2" />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button type="button" onClick={()=>removeRow(idx)} className="text-sm text-red-600 hover:underline" disabled={techRows.length===1}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3">
            <button type="button" onClick={addRow} className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50">
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
<div className="pt-4 flex justify-center">
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
            Demande enregistrée. ID&nbsp;: <span className="font-semibold">{successId}</span>
          </div>
        )}
        {error && <div className="text-red-600">{error}</div>}

{/* Résultat shortlist */}
{!loadingShortlist && shortlist?.length > 0 && (
  <div className="mt-6">
<h3 className="text-2xl md:text-3xl font-semibold text-center text-[#8EBDFC] mb-2">Top 10</h3>
<div className="mx-auto mb-4 h-1 w-16 rounded-full bg-[#8EBDFC]" />
    <div className="space-y-3">
      {shortlist.map(r => (
<div key={r.userId} className="rounded-2xl border border-[#8EBDFC]/30 bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Profil</div>
              <div className="text-lg font-semibold">ID {r.userId}</div>
            </div>
<span className="inline-flex items-center rounded-full border border-[#8EBDFC] bg-[#8EBDFC]/10 px-3 py-1 text-sm font-semibold text-blue-700">
              score {r.score}%
            </span>
          </div>

          {r.details && (
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <span className="inline-flex items-center rounded-full bg-[#8EBDFC]/10 text-blue-800
 px-3 py-1">skills {r.details.skills}%</span>
              <span className="inline-flex items-center rounded-full bg-[#8EBDFC]/10 text-blue-800
 px-3 py-1">tjm {r.details.tjm}%</span>
              <span className="inline-flex items-center rounded-full bg-[#8EBDFC]/10 text-blue-800
 px-3 py-1">{locationLabel} {r.details.location}%</span>
              <span className="inline-flex items-center rounded-fullbg-[#8EBDFC]/10 text-blue-800
 px-3 py-1">dispo {r.details.availabilityText}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)}
        {loadingShortlist && <p className="mt-4 text-sm">Calcul de la shortlist…</p>}
      </form>
    </section>
  )
}
