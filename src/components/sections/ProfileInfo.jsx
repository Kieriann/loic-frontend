//
// ─── Bloc formulaire : informations personnelles + tarifs ─────────
//

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
            onChange={(e) => setData({ ...data, firstname: e.target.value })}
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
            onChange={(e) => setData({ ...data, lastname: e.target.value })}
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
            onChange={(e) => setData({ ...data, phone: e.target.value })}
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
            onChange={(e) => setData({ ...data, siret: e.target.value })}
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
          onChange={(e) => setData({ ...data, bio: e.target.value })}
          className="w-full p-2 border border-primary rounded resize-y min-h-[120px]"
        />
        {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
      </div>

      <div>
        <label className="text-xl font-semibold text-darkBlue">Tarifs journaliers</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-darkBlue mb-1">TJM petit projet (€)</label>
            <input
              name="smallDayRate"
              type="number"
              value={data.smallDayRate}
              onChange={(e) => setData({ ...data, smallDayRate: Number(e.target.value) })}
              className="p-2 border border-primary rounded w-full"
            />
            {errors.smallDayRate && <p className="text-red-500 text-sm mt-1">{errors.smallDayRate}</p>}
          </div>
          <div>
            <label className="block text-sm text-darkBlue mb-1">TJM moyen projet (€)</label>
            <input
              type="number"
              value={data.mediumDayRate}
              onChange={(e) => setData({ ...data, mediumDayRate: Number(e.target.value) })}
              className="p-2 border border-primary rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-darkBlue mb-1">TJM gros projet (€)</label>
            <input
              type="number"
              value={data.highDayRate}
              onChange={(e) => setData({ ...data, highDayRate: Number(e.target.value) })}
              className="p-2 border border-primary rounded w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
