import React, { useState, useMemo } from "react";

export default function ShortlistDebug({ result, weights, reqTechs }) {
  const [open, setOpen] = useState(false);

const w = weights || { skills: 0, tjm: 0, telework: 0 };
  const totalW =
    (Number(w.skills) || 0) +
    (Number(w.tjm) || 0) +
    (Number(w.telework) || 0);

  const perTech = Array.isArray(result?.details?.skills?.details)
    ? result.details.skills.details
    : [];

  const reqMap = useMemo(() => {
    const m = Object.create(null);
    (reqTechs || []).forEach((t) => {
      const key = String(t?.technology ?? t?.name ?? "")
        .trim()
        .toLowerCase();
      m[key] = {
        name: t?.technology ?? t?.name ?? "",
        level: t?.level ?? "",
        weight: Number(t?.weight) || 0,
      };
    });
    return m;
  }, [reqTechs]);

  const skillsPct = Number(result?.details?.skills?.total ?? 0);
  const tjmPct = Number(result?.details?.tjm ?? 0);
const telePct = Number(result?.details?.telework ?? 0);


  const scoreNum =
    totalW > 0
      ? (((skillsPct / 100) * (w.skills || 0) +
  (tjmPct / 100) * (w.tjm || 0) +
  (telePct / 100) * (w.telework || 0)) /
  totalW) *
100
      : 0;

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-sm underline text-blue-700 hover:text-blue-900"
      >
        {open ? "Masquer le détail des calculs" : "Voir le détail des calculs"}
      </button>

      {open && (
        <div className="mt-2 rounded-xl border border-[#8EBDFC]/40 bg-[#F8FBFF] p-3">
          {/* Résumé */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center rounded-full bg-[#EAF2FF] px-2 py-0.5 text-sm">
              skills {skillsPct}% × {w.skills}
            </span>
            <span className="inline-flex items-center rounded-full bg-[#EAF2FF] px-2 py-0.5 text-sm">
              tjm {tjmPct}% × {w.tjm}
            </span>
            <span className="inline-flex items-center rounded-full bg-[#EAF2FF] px-2 py-0.5 text-sm">
            télétravail {telePct}% × {w.telework}
            </span>
          </div>

{/* Formule */}
<div className="text-xs text-gray-700 mb-3">
  Score = (skills/100 × {w.skills}) + (tjm/100 × {w.tjm}) + (télétravail/100 × {w.telework}) ÷ ({totalW}) × 100 = {Math.round(scoreNum)}% 
</div>


          {/* Détail par techno */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Technologie</th>
                  <th className="px-3 py-2 text-left font-semibold">Attendu</th>
                  <th className="px-3 py-2 text-left font-semibold">Profil</th>
                  <th className="px-3 py-2 text-left font-semibold">Poids</th>
                  <th className="px-3 py-2 text-right font-semibold">Match</th>
                </tr>
              </thead>
              <tbody>
                {perTech.length === 0 && (
                  <tr>
                    <td className="px-3 py-2" colSpan={5}>
                      Aucune techno demandée.
                    </td>
                  </tr>
                )}
                {perTech.map((t, i) => {
                  const key = String(t?.techName ?? "").toLowerCase();
                  const req = reqMap[key] || {
                    name: t?.techName ?? "",
                    level: t?.requestedLevel ?? "",
                    weight: 0,
                  };
                  return (
                    <tr key={i} className={i > 0 ? "border-t" : ""}>
                      <td className="px-3 py-2">{req.name}</td>
                      <td className="px-3 py-2">
                        {t?.requestedLevel ?? req.level}
                        <span className="text-xs text-gray-500">
                          {" "}
                          ({t?.requestedNum})
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        {t?.profileLevel ?? "—"}
                        <span className="text-xs text-gray-500">
                          {" "}
                          ({t?.profileNum})
                        </span>
                      </td>
                      <td className="px-3 py-2 tabular-nums">{req.weight}</td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {Number(t?.match ?? 0)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Composants unitaires */}
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg border border-gray-200 bg-white p-2">
              <div className="text-gray-500 text-xs">TJM (profil)</div>
              <div className="font-semibold">
                {result?.details?.tjmMin != null && result?.details?.tjmMax != null
                  ? `${result.details.tjmMin}–${result.details.tjmMax} €`
                  : result?.details?.tjmValue != null
                  ? `${result.details.tjmValue} €`
                  : "—"}
              </div>
              <div className="text-xs text-gray-600">score {tjmPct}%</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-2">
              <div className="text-gray-500 text-xs">Télétravail</div>
              <div className="font-semibold">
                {result?.details?.teleworkDays != null
                  ? `${result.details.teleworkDays} j/s`
                  : "—"}
              </div>
                <div className="text-xs text-gray-600">score {telePct}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
