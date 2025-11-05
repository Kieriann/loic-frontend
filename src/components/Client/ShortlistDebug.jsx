// ─── Détail shortlist : cercle + tableau (maquette client) ───
import React from 'react'

/* Cercle pourcentage (SVG) – sans libellé sous le cercle */
function PercentCircle({ value = 0, size = 120, stroke = 10 }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const v = Math.max(0, Math.min(100, Math.round(value)))
  const dash = (v / 100) * c
  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} aria-label="Score global">
        <g transform={`translate(${size/2},${size/2})`}>
          <circle r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
          <circle r={r} fill="none" stroke="#8EBDFC" strokeWidth={stroke} strokeLinecap="round"
                  strokeDasharray={`${dash} ${c-dash}`} transform="rotate(-90)" />
          <text textAnchor="middle" dominantBaseline="middle"
                fontSize={Math.round(size*0.28)} fontWeight="700" fill="#111827">
            {v}%
          </text>
        </g>
      </svg>
    </div>
  )
}

const levelLabel = (v) =>
  ({ beginner:'Débutant', junior:'Junior', intermediate:'Intermédiaire', senior:'Senior', expert:'Expert' }[String(v||'').toLowerCase()] || v)

const getPerTech = (r) =>
  (typeof r?.details?.skills === 'object') ? (r.details.skills.details || []) : []

export default function ShortlistDebug({ result, weights, reqTechs }) {
  if (!result) return null

  // Map techno -> détail API
  const perTech = getPerTech(result)
  const perTechMap = new Map(perTech.map(d => [String(d.techName || '').toLowerCase(), d]))

  // Lignes demandées côté client
  const reqTechList = (Array.isArray(reqTechs) ? reqTechs : [])
    .filter(t => (t.technology || '').trim())
    .map(t => ({
      name: String(t.technology).trim(),
      levelLabel: levelLabel(t.level),
      weight: Number(t.weight) || 0,
    }))

  // Items = toutes technos + TJM + Télétravail
  const skillItems = reqTechList.map(t => {
    const f = perTechMap.get(t.name.toLowerCase())
    const matchPct = Math.max(0, Math.min(100, f?.match ?? 0))
    return { kind:'skill', name:t.name, matchPct, weight:t.weight }
  })

  const tjmItem  = { kind:'tjm',   name:'TJM',         matchPct:Number(result?.details?.tjm      ?? 0), weight:Number(weights?.tjm      || 0) }
  const teleItem = { kind:'tele',  name:'Télétravail', matchPct:Number(result?.details?.telework ?? 0), weight:Number(weights?.telework || 0) }

  const items = [...skillItems, tjmItem, teleItem]

  // Colonnes calculées
  const cols = items.map(it => {
    const header = `${it.name} (${Math.round(it.matchPct)}% × ${it.weight})` // ← espace avant ( )
    const unit   = Math.round(it.matchPct * it.weight)
    return { header, unit, weight: it.weight }
  })

  const unitSum   = cols.reduce((a,c)=>a+c.unit, 0)
  const weightSum = cols.reduce((a,c)=>a+c.weight, 0)
  const globalPct = weightSum ? (unitSum / weightSum) : 0

  const fr = (n) => (typeof n === 'number' ? n.toLocaleString('fr-FR') : n)

  return (
    <details className="mt-3 group">
      <summary className="cursor-pointer select-none list-none">
        <div className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm text-blue-900 bg-blue-50 border border-blue-200">
          <span className="font-semibold">Détail du calcul</span>
          <span className="opacity-70 group-open:hidden">▼</span>
          <span className="opacity-70 hidden group-open:inline">▲</span>
        </div>
      </summary>

      {/* CERCLE */}
      <div className="mt-4 flex justify-center">
        <PercentCircle value={globalPct} />
      </div>

      {/* TABLEAU – fond grisé UNIQUEMENT sur la 1ʳᵉ colonne, chiffres centrés, sans “+” */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="text-gray-700">
            <tr>
<th className="px-3 py-2 text-left font-semibold w-24 bg-gray-50">Attendus</th>
            {cols.map((c, i) => (
              <th key={`h-${i}`} className="px-3 py-2 text-left font-medium bg-white">{c.header}</th>
            ))}
<th className="px-3 py-2 text-center font-semibold w-24 bg-gray-50">Total</th>

            </tr>
          </thead>
          <tbody>
            {/* Scores unitaires */}
            <tr className="border-t">
              <td className="px-3 py-2 font-semibold bg-gray-50">Scores unitaires</td>
              {cols.map((c, i) => (
                <td key={`u-${i}`} className="px-3 py-2 text-center tabular-nums">{fr(c.unit)}</td>
              ))}
<td className="px-3 py-2 text-center tabular-nums bg-gray-50 font-semibold">= {fr(unitSum)}</td>
            </tr>

            {/* Importance */}
            <tr className="border-t">
              <td className="px-3 py-2 font-semibold bg-gray-50">Importance</td>
              {cols.map((c, i) => (
                <td key={`w-${i}`} className="px-3 py-2 text-center tabular-nums">{fr(c.weight)}</td>
              ))}
<td className="px-3 py-2 text-center tabular-nums bg-gray-50 font-semibold">= {fr(weightSum)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SCORE GLOBAL – centré, plus gros, plus visible */}
      <div className="mt-4 flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#8EBDFC] bg-[#EAF2FF] px-4 py-2">
          <span className="text-base font-semibold">Score global</span>
          <span className="text-2xl font-extrabold tabular-nums">
            {fr(unitSum)} / {fr(weightSum)} = {(weightSum ? (unitSum/weightSum) : 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
          </span>
        </div>
      </div>
    </details>
  )
}
