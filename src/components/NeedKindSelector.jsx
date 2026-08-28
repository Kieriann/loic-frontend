import React from 'react'

export default function NeedKindSelector({ value, onChange, only }) {
  const isOnly = Array.isArray(only) && only.length > 0
  const allow = (k) => !isOnly || only.includes(k)

  return (
    <div className="flex flex-wrap items-center gap-6">
      {allow('mission') && (
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            value="mission"
            checked={value === 'mission'}
            onChange={() => onChange('mission')}
          />
          <span>une mission</span>
        </label>
      )}

      {allow('outil') && (
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            value="outil"
            checked={value === 'outil'}
            onChange={() => onChange('outil')}
          />
          <span>un outil</span>
        </label>
      )}

      {allow('expertise') && (
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            value="expertise"
            checked={value === 'expertise'}
            onChange={() => onChange('expertise')}
          />
          <span>une expertise</span>
        </label>
      )}

      {allow('preembauche') && (
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            value="preembauche"
            checked={value === 'preembauche'}
            onChange={() => onChange('preembauche')}
          />
          <span>pré-embauche</span>
        </label>
      )}

      {allow('alternance') && (
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            value="alternance"
            checked={value === 'alternance'}
            onChange={() => onChange('alternance')}
          />
          <span>alternance</span>
        </label>
      )}
    </div>
  )
}
