import React from 'react'

export default function ProfileInfo({ data, setData, errors = {} }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-darkBlue">Informations personnelles</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <input
            name="firstname"
            type="text"
            placeholder="Prénom"
            value={data.firstname}
            onChange={e => setData({ ...data, firstname: e.target.value })}
            className="p-2 border border-primary rounded w-full"
          />
          {errors.firstname && <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>}
        </div>
        <div>
          <input
            name="lastname"
            type="text"
            placeholder="Nom"
            value={data.lastname}
            onChange={e => setData({ ...data, lastname: e.target.value })}
            className="p-2 border border-primary rounded w-full"
          />
          {errors.lastname && <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>}
        </div>
        <div>
          <input
            name="phone"
            type="tel"
            placeholder="Téléphone"
            value={data.phone}
            onChange={e => setData({ ...data, phone: e.target.value })}
            className="p-2 border border-primary rounded w-full"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
        <div>
          <input
            name="siret"
            type="text"
            placeholder="SIRET"
            value={data.siret}
            onChange={e => setData({ ...data, siret: e.target.value })}
            className="p-2 border border-primary rounded w-full"
          />
          {errors.siret && <p className="text-red-500 text-sm mt-1">{errors.siret}</p>}
        </div>
      </div>

      <div>
        <textarea
          name="bio"
          placeholder="Bio"
          rows={6}
          value={data.bio}
          onChange={e => setData({ ...data, bio: e.target.value })}
          className="w-full p-2 border border-primary rounded resize-y min-h-[120px]"
        />
        {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
      </div>

      <div>
        <label className="text-xl font-semibold text-darkBlue">Tarifs journaliers</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-darkBlue mb-1">TJM courte durée (€)</label>
            <input
              name="smallDayRate"
              type="number"
              placeholder="—"
              value={data.smallDayRate}
              onChange={e => {
                const v = e.target.value
                setData({
                  ...data,
                  smallDayRate: v === '' ? '' : Number(v),
                })
              }}
              className="p-2 border border-primary rounded w-full"
            />
            {errors.smallDayRate && <p className="text-red-500 text-sm mt-1">{errors.smallDayRate}</p>}
          </div>
          <div>
            <label className="block text-sm text-darkBlue mb-1">TJM moyenne durée (€)</label>
            <input
              name="mediumDayRate"
              type="number"
              placeholder="—"
              value={data.mediumDayRate}
              onChange={e => {
                const v = e.target.value
                setData({
                  ...data,
                  mediumDayRate: v === '' ? '' : Number(v),
                })
              }}
              className="p-2 border border-primary rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-darkBlue mb-1">TJM longue durée (€)</label>
            <input
              name="highDayRate"
              type="number"
              placeholder="—"
              value={data.highDayRate}
              onChange={e => {
                const v = e.target.value
                setData({
                  ...data,
                  highDayRate: v === '' ? '' : Number(v),
                })
              }}
              className="p-2 border border-primary rounded w-full"
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-xl font-semibold text-darkBlue mb-1">Télétravail</label>
        <div className="flex items-center gap-2">
          <span>Je souhaite télétravailler</span>
          <select
            name="teleworkDays"
            value={data.teleworkDays}
            onChange={e => setData({ ...data, teleworkDays: Number(e.target.value) })}
            className="p-2 border border-primary rounded"
          >
            {[0,1,2,3,4,5].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span>jour(s) sur 5 jours travaillés.</span>
        </div>
      </div>
    </div>
  )
}
