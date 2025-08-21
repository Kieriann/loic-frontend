import React, { useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { createPortal } from 'react-dom'

export default function QAFlipCard({
  question,
  answer,
  fullText = 'Texte long en plein écran (factice). Ajoute infos, exemples, process, FAQ, etc.'
}) {
  const [flipped, setFlipped] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const selfId = question || 'qa-item'

  const expanderRoot =
    typeof document !== 'undefined' ? document.getElementById('qa-expand') : null

  // ---- Scroll auto uniquement à l'ouverture (pas après) ----
  const expandedPanelRef = useRef(null)
  const didScrollOnceRef = useRef(false)

  useEffect(() => {
    if (expanded && expandedPanelRef.current && !didScrollOnceRef.current) {
      didScrollOnceRef.current = true
      expandedPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    if (!expanded) {
      didScrollOnceRef.current = false
    }
  }, [expanded])

  // Fermer cette carte si une autre s’ouvre
  useEffect(() => {
    const onAnyExpand = (e) => {
      const openedId = e?.detail?.id
      if (openedId !== selfId && expanded) {
        setExpanded(false)
      }
    }
    window.addEventListener('qa:expand', onAnyExpand)
    return () => window.removeEventListener('qa:expand', onAnyExpand)
  }, [expanded, selfId])

  // Panneau étendu rendu dans un portal (pousse le contenu)
  const ExpandedPanel =
    expanded && expanderRoot
      ? createPortal(
          <div id="qa-expand-panel" className="w-full" ref={expandedPanelRef}>
            <div className="w-full max-w-5xl mx-auto rounded-3xl border border-blue-300 bg-white p-6 shadow-md">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">{question}</h2>
              <div className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-line">
                {fullText}
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-blue-400 px-4 py-2 text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  aria-label="Réduire"
                  title="Réduire"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 14l6-6 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                  Réduire
                </button>
              </div>
            </div>
          </div>,
          expanderRoot
        )
      : null

  return (
    <>
      {/* Carte dans la ronde */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="w-full h-40 overflow-hidden bg-white text-center p-2 rounded-2xl shadow-lg cursor-pointer perspective"
      >
        <div
          className={cx(
            'relative w-full h-full transition-transform duration-500',
            flipped ? 'rotate-y-180' : ''
          )}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Face avant */}
          <div className="absolute inset-0 backface-hidden flex items-center justify-center px-2 text-blue-500 font-semibold text-[15px] leading-tight text-center">
            {question}
          </div>

          {/* Face arrière + flèche intégrée */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col rounded-2xl bg-blue-50">
            <div className="flex-1 px-2 py-1 flex items-center justify-center text-gray-700 font-medium text-[13px] leading-tight text-center">
              {answer}
            </div>
            <div className="py-1 flex justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  // notifier les autres cartes de se fermer
                  window.dispatchEvent(new CustomEvent('qa:expand', { detail: { id: selfId } }))
                  setFlipped(true)
                  setExpanded(true)
                }}
                className="flex items-center justify-center text-blue-600 hover:text-blue-800 focus:outline-none"
                aria-label="Agrandir"
                title="Agrandir"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Panneau étendu */}
      {ExpandedPanel}
    </>
  )
}
