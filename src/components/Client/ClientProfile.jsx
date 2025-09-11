import React, { useEffect, useState } from 'react'
import { getClientProfile, saveClientProfile } from '../../api/clientProfile'

// ── PROFIL CLIENT : lecture/édition sur la même page ────────────────
export default function ClientProfile() {
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    clientType: 'CLIENT_FINAL',
    companyName: '',
    siret: '',
    sector: '',
    contactFirstName: '',
    contactLastName: '',
    contactRole: '',
    email: '',
    phone: '',
    addressStreet: '',
    addressPostalCode: '',
    addressCity: '',
    addressCountry: '',
  })

  const [message, setMessage] = useState('')

  const requiredFields = [
    'clientType',
    'companyName',
    'siret',
    'sector',
    'contactFirstName',
    'contactLastName',
    'contactRole',
    'email',
    'addressStreet',
    'addressPostalCode',
    'addressCity',
    'addressCountry',
  ]

  useEffect(() => {
    (async () => {
      setLoading(true)
      const data = await getClientProfile()
      if (data) {
        setForm({
          clientType: data.clientType || 'CLIENT_FINAL',
          companyName: data.companyName || '',
          siret: data.siret || '',
          sector: data.sector || '',
          contactFirstName: data.contactFirstName || '',
          contactLastName: data.contactLastName || '',
          contactRole: data.contactRole || '',
          email: data.email || '',
          phone: data.phone || '',
          addressStreet: data.addressStreet || '',
          addressPostalCode: data.addressPostalCode || '',
          addressCity: data.addressCity || '',
          addressCountry: data.addressCountry || '',
        })
        setEditing(false)
      } else {
        setEditing(true)
      }
      setLoading(false)
    })()
  }, [])

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSave = async () => {
    setMessage('')
    for (const field of requiredFields) {
      if (!form[field] || form[field].trim() === '') {
        setMessage('Merci de remplir tous les champs obligatoires.')
        return
      }
    }
    await saveClientProfile(form)
    setEditing(false)
    setMessage('Enregistré.')
  }

  if (loading) return <div className="p-4">Chargement…</div>

  return (
    <div className="p-4 space-y-4">
      <div className="mb-2">
        <span className="text-sm text-gray-600 block mb-1">Type d’organisation</span>
        <div className="flex gap-6 items-center">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="clientType"
              value="CLIENT_FINAL"
              checked={form.clientType === 'CLIENT_FINAL'}
              onChange={(e) => setForm(f => ({ ...f, clientType: e.target.value }))}
              disabled={!editing}
            />
            <span>Client final</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="clientType"
              value="ESN"
              checked={form.clientType === 'ESN'}
              onChange={(e) => setForm(f => ({ ...f, clientType: e.target.value }))}
              disabled={!editing}
            />
            <span>ESN</span>
          </label>
        </div>
      </div>

      {/* Titre + boutons à droite, message SOUS le(s) bouton(s) */}
      <div className="flex items-start justify-between">
        <h2 className="text-xl font-semibold">Profil client</h2>
        <div className="flex flex-col items-end gap-1">
          {!editing ? (
            <button
              className="px-3 py-1 rounded bg-blue-500 text-white"
              onClick={() => setEditing(true)}
            >
              Modifier
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                className="px-3 py-1 rounded bg-gray-200"
                onClick={() => setEditing(false)}
              >
                Annuler
              </button>
              <button
                className="px-3 py-1 rounded bg-blue-600 text-white"
                onClick={onSave}
              >
                Enregistrer
              </button>
            </div>
          )}
          {message && (
            <span className={message === 'Enregistré.' ? 'text-green-600' : 'text-red-600'}>
              {message}
            </span>
          )}
        </div>
      </div>

      {/* ── Informations entreprise ───────────────────────────────────── */}
      <div className="mt-2">
        <h3 className="text-lg font-medium mb-2">Informations entreprise</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Raison sociale *">
            <Input name="companyName" value={form.companyName} onChange={onChange} disabled={!editing} />
          </Field>
          <Field label="SIRET *">
            <Input name="siret" value={form.siret} onChange={onChange} disabled={!editing} />
          </Field>
          <Field label="Secteur d’activité *">
            <Input name="sector" value={form.sector} onChange={onChange} disabled={!editing} />
          </Field>
          <Field label="Adresse *">
            <Input name="addressStreet" value={form.addressStreet} onChange={onChange} disabled={!editing} />
          </Field>
          <Field label="Code postal *">
            <Input name="addressPostalCode" value={form.addressPostalCode} onChange={onChange} disabled={!editing} />
          </Field>
          <Field label="Ville *">
            <Input name="addressCity" value={form.addressCity} onChange={onChange} disabled={!editing} />
          </Field>
          <Field label="Pays *">
            <Input name="addressCountry" value={form.addressCountry} onChange={onChange} disabled={!editing} />
          </Field>
        </div>
      </div>

      {/* ── Point de contact ──────────────────────────────────────────── */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Point de contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Prénom *">
            <Input name="contactFirstName" value={form.contactFirstName} onChange={onChange} disabled={!editing} />
          </Field>
          <Field label="Nom *">
            <Input name="contactLastName" value={form.contactLastName} onChange={onChange} disabled={!editing} />
          </Field>
          <Field label="Poste *">
            <Input name="contactRole" value={form.contactRole} onChange={onChange} disabled={!editing} />
          </Field>
          <Field label="Email pro *">
            <Input name="email" type="email" value={form.email} onChange={onChange} disabled={!editing} />
          </Field>
          <Field label="Téléphone">
            <Input name="phone" value={form.phone} onChange={onChange} disabled={!editing} />
          </Field>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full border rounded-lg px-3 py-2 outline-none disabled:bg-gray-50"
    />
  )
}
