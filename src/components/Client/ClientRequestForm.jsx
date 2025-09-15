import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CitySelect from './CitySelect'
import { createClientRequest } from '../../api'
import { getClientRequest, updateClientRequest } from '../../api/clientRequests'


export default function ClientRequestForm() {
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const [kind, setKind] = useState('expertise') // 'expertise' | 'mission'
  const [technology, setTechnology] = useState('')
  const [level, setLevel] = useState('junior')
  const [remote, setRemote] = useState(true)
  const [city, setCity] = useState(null) // { id, name, country }
  const [loading, setLoading] = useState(false)
  const [successId, setSuccessId] = useState(null)
  const [error, setError] = useState('')

    useEffect(() => {
    if (!editId) return
    (async () => {
      const r = await getClientRequest(editId)
      setKind(r.kind === 'MISSION' ? 'mission' : 'expertise')
      setTechnology(r.technology || '')
      setLevel((r.level || 'JUNIOR').toLowerCase())
      const isRemote = r.locationMode === 'REMOTE'
      setRemote(isRemote)
      if (!isRemote) {
        if (r.city) {
          setCity({ id: r.city.id, name: r.city.name, country: r.city.countryCode })
        } else {
          setCity(null)
        }
      } else {
        setCity(null)
      }
    })().catch(console.error)
  }, [editId])


  const canSubmit =
    kind && technology.trim() && level && (remote || (!remote && city?.name))

  const submit = async e => {
    e.preventDefault()
    if (!canSubmit || loading) return
    setError('')
    setLoading(true)
    try {
      const payload = {
        kind, // 'expertise' | 'mission'
        technology: technology.trim(),
        level, // 'junior' | 'medium' | 'expert'
        location: remote ? { mode: 'remote' } : { mode: 'onsite', city },
      }
      const resp = editId
        ? await updateClientRequest(editId, payload)
        : await createClientRequest(payload)
      const { id } = resp
      setSuccessId(id)
     // reset minimal si création
      if (!editId) {
        setTechnology('')
        if (!remote) setCity(null)
      }
    } catch (err) {
      setError(err?.message || 'Échec de l’enregistrement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <form onSubmit={submit} className="space-y-6">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vous cherchez
          </label>
          <div className="flex items-center gap-6">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="kind"
                value="expertise"
                checked={kind === 'expertise'}
                onChange={() => setKind('expertise')}
              />
              <span>une expertise</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="kind"
                value="mission"
                checked={kind === 'mission'}
                onChange={() => setKind('mission')}
              />
              <span>une mission</span>
            </label>
          </div>
        </div>

        {/* Technologie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Technologie
          </label>
          <input
            type="text"
            value={technology}
            onChange={e => setTechnology(e.target.value)}
            placeholder="Ex: React, Java, Kubernetes…"
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        {/* Niveau */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Niveau
          </label>
          <select
            value={level}
            onChange={e => setLevel(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 bg-white"
          >
            <option value="junior">Junior</option>
            <option value="medium">Medium</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        {/* Localisation */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Localisation
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={remote}
              onChange={e => setRemote(e.target.checked)}
            />
            <span>Télétravail</span>
          </label>

          {!remote && (
            <div>
              <CitySelect value={city} onChange={setCity} />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
          >
            {loading ? 'Enregistrement…' : editId ? 'Mettre à jour' : 'Envoyer la demande'}
          </button>
        </div>

        {/* Messages */}
        {successId && (
          <div className="text-green-700">
            Demande enregistrée. ID&nbsp;: <span className="font-semibold">{successId}</span>
          </div>
        )}
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </section>
  )
}
