import React, { useState } from 'react'

export default function QAFlipCardExpanded({
  title = 'Étiquette',
  frontText = 'Face avant',
  // (on ignore backText et la rotation)
  fullText = `Texte long en mode agrandi. Contenu factice pour test.`
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (isExpanded) {
    return (
      <div className="w-full rounded-3xl border border-blue-300 bg-white p-6 shadow-md">
        <div className="mb-3 text-lg font-semibold text-blue-700">{title}</div>
        <div className="prose max-w-none text-sm leading-relaxed">
          {fullText}
        </div>
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="inline-flex items-center gap-2 rounded-full border border-blue-400 px-4 py-2 text-blue-600 hover:bg-blue-50"
          >
            {/* flèche vers le haut */}
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 14l6-6 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
            Réduire
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="w-full sm:w-80"
      onClick={() => setIsExpanded(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsExpanded(true)}
    >
      {/* Face avant uniquement, cliquable */}
      <div className="h-56 w-full cursor-pointer rounded-3xl bg-white p-4 text-center shadow-md flex flex-col justify-center">
        <div className="mb-2 text-sm font-semibold text-blue-700">{title}</div>
        <p className="text-sm text-gray-700">{frontText}</p>
      </div>
    </div>
  )
}
