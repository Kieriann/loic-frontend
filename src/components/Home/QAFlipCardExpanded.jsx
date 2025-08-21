import React, { useState } from 'react'

export default function QAFlipCardExpanded({
  title = 'Étiquette',
  frontText = 'Face avant',
  backText = 'Texte court au dos',
  fullText = `Texte long en mode agrandi. Contenu factice pour test.`
}) {
  const [isFlipped, setIsFlipped] = useState(false)
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
    <div className="w-full sm:w-80 [perspective:1000px]">
      <div
        className={`relative h-56 w-full cursor-pointer rounded-3xl transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
        style={{ overflow: 'visible' }}
        onClick={() => setIsFlipped(v => !v)}
      >
        {/* Face avant */}
        <div className="absolute inset-0 flex flex-col justify-center rounded-3xl bg-white p-4 text-center shadow-md [backface-visibility:hidden]">
          <div className="mb-2 text-sm font-semibold text-blue-700">{title}</div>
          <p className="text-sm text-gray-700">{frontText}</p>
        </div>

        {/* Face arrière */}
        <div className="absolute inset-0 flex flex-col rounded-3xl bg-blue-50 text-center shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="flex-1 p-4 overflow-auto">
            <div className="mb-2 text-sm font-semibold text-blue-700">{title}</div>
            <p className="text-sm text-gray-700">{backText}</p>
          </div>

          <div className="border-t border-blue-200 bg-white/80 p-3">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setIsExpanded(true) }}
              className="mx-auto flex items-center gap-2 rounded-full border border-blue-400 px-4 py-2 text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Agrandir"
              title="Agrandir"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
              <span className="text-sm font-medium">Agrandir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
