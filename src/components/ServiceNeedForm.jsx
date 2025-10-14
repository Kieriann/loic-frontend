import React, { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || ''


export default function ServiceNeedForm() {
  const [items, setItems] = useState([{ skillLabel: '', level: 'intermédiaire' }])
  const [description, setDescription] = useState('')
  const [minRate, setMinRate] = useState('')
  const [maxRate, setMaxRate] = useState('')
  const [deadline, setDeadline] = useState('')
  const [sent, setSent] = useState(false)


  const addItem    = () => setItems([...items, { skillLabel: '', level: 'intermédiaire' }])
  const updateItem = (i, field, val) => {
    const copy = [...items]
    copy[i][field] = val
    setItems(copy)
  }
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i))

  const submit = async () => {
    const token = localStorage.getItem('token')
 await axios.post(`${API}/api/service-requests`, {
      title: '',
      description,
      minRate: Number(minRate),
      maxRate: Number(maxRate),
      deadline: deadline || null,
      items: items.filter(it => it.skillLabel.trim()),
    }, { headers: { Authorization: `Bearer ${token}` } })

    window.dispatchEvent(new CustomEvent('service-need:created'))

    window.dispatchEvent(new CustomEvent('service-need:created'))
    setSent(true)
    setTimeout(() => setSent(false), 2500)
    // reset simple
    setItems([{ skillLabel: '', level: 'intermédiaire' }])
    setDescription('')
    setMinRate('')
    setMaxRate('')
    setDeadline('')
  }

  return (
  <div className="rounded-2xl border p-4 bg-white space-y-4">
    {/* Technologies, langages */}
    <div>
      <div className="text-sm font-semibold mb-2">Technologies, langages :</div>
      {items.map((it, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            placeholder="Langage / Logiciel (ex: React, Photoshop)"
            value={it.skillLabel}
            onChange={e => updateItem(i, 'skillLabel', e.target.value)}
            className="input input-bordered w-full"
          />
          <select
            value={it.level}
            onChange={e => updateItem(i, 'level', e.target.value)}
            className="select select-bordered"
          >
            <option value="junior">junior</option>
            <option value="intermédiaire">intermédiaire</option>
            <option value="expert">expert</option>
          </select>
          <button type="button" onClick={() => removeItem(i)} className="btn">-</button>
        </div>
      ))}
      <button type="button" onClick={addItem} className="btn">+ Ajouter</button>
    </div>

    {/* Texte de ma demande */}
    <div>
      <div className="text-sm font-semibold mb-2">Texte de ma demande :</div>
      <textarea
        placeholder="Décrivez votre besoin en quelques lignes"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="textarea textarea-bordered w-full"
      />
    </div>

    {/* Enveloppe budgétaire */}
    <div>
      <div className="text-sm font-semibold mb-2">Enveloppe budgétaire :</div>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="0€"
          value={minRate}
          onChange={e => setMinRate(e.target.value)}
          className="input input-bordered w-full"
        />

      </div>
    </div>

    {/* Date butoir */}
    <div>
      <div className="text-sm font-semibold mb-2">Date butoir :</div>
      <input
        type="date"
        value={deadline}
        onChange={e => setDeadline(e.target.value)}
        className="input input-bordered"
      />
    </div>

    <div className="flex justify-end">
        {sent && <p className="text-green-600 text-sm">Demande créée.</p>}
    <button type="button" onClick={submit} className="btn btn-primary">Créer la demande</button>
    </div>
  </div>
)

}
