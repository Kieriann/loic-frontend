import React from 'react'

const fr = (n) => (typeof n === 'number' ? n.toLocaleString('fr-FR') : n)
const pct = (n) => `${Math.round(n)}%`

export default function ShortlistTable({
  skillLines = [],    // [{ name:'Cobol', matchPct:100, weight:7 }, ...]
  tjm = { matchPct: 0, weight: 0 },
  telework = { matchPct: 0, weight: 0 },
}) {
  const rows = [
    ...skillLines.map(s => ({
      attendu: `${s.name} (${pct(s.matchPct)}×${s.weight})`,
      unit: Math.round(s.matchPct * s.weight),
      weight: s.weight,
    })),
    { attendu: `TJM (${pct(tjm.matchPct)}×${tjm.weight})`, unit: Math.round(tjm.matchPct * tjm.weight), weight: tjm.weight },
    { attendu: `Télétravail (${pct(telework.matchPct)}×${telework.weight})`, unit: Math.round(telework.matchPct * telework.weight), weight: telework.weight },
  ]

  const unitSum = rows.reduce((a, r) => a + r.unit, 0)
  const weightSum = rows.reduce((a, r) => a + r.weight, 0)
  const global = weightSum ? (unitSum / weightSum) : 0

  return (
    <div className="mt-6">
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-left font-semibold w-64">Attendus</th>
              <th className="px-3 py-2 text-left font-semibold">Scores unitaires</th>
              <th className="px-3 py-2 text-left font-semibold">Importance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="px-3 py-2">{r.attendu}</td>
                <td className="px-3 py-2">{fr(r.unit)}</td>
                <td className="px-3 py-2">{fr(r.weight)}</td>
              </tr>
            ))}
            <tr className="border-t bg-gray-50 font-semibold">
              <td className="px-3 py-2">Totaux</td>
              <td className="px-3 py-2">{fr(unitSum)}</td>
              <td className="px-3 py-2">{fr(weightSum)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-sm">
        <span className="font-semibold">Score global :</span>{' '}
        {fr(unitSum)} / {fr(weightSum)} = {global.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    </div>
  )
}
