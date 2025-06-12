//
// ─── Bloc formulaire : adresse de l'utilisateur ───────────────────
//

import React from 'react'

export default function AddressInfo({ data, setData, errors = {} }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-darkBlue">Adresse</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <input
            name="address"
            type="text"
            placeholder="Adresse"
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
            className="p-2 border border-primary rounded w-full"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>
        <div>
          <input
            name="city"
            type="text"
            placeholder="Ville"
            value={data.city}
            onChange={(e) => setData({ ...data, city: e.target.value })}
            className="p-2 border border-primary rounded w-full"
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>
        <div>
          <input
            name="postalCode"
            type="text"
            placeholder="Code postal"
            value={data.postalCode}
            onChange={(e) => setData({ ...data, postalCode: e.target.value })}
            className="p-2 border border-primary rounded w-full"
          />
          {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
        </div>
        <div>
          <input
            name="country"
            type="text"
            placeholder="Pays"
            value={data.country}
            onChange={(e) => setData({ ...data, country: e.target.value })}
            className="p-2 border border-primary rounded w-full"
          />
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
        </div>
      </div>
    </div>
  )
}
