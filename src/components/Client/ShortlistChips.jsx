import React from 'react'
import cx from 'classnames'

export default function ShortlistChips({ items = [] }) {
  return (
    <div className="w-full flex flex-wrap gap-3">
      {items.map((it, i) => (
        <div
          key={i}
          className={cx(
            'inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50',
            'px-4 py-2 text-sm text-gray-700 shadow-sm'
          )}
        >
          <span className="font-semibold">{it.label} :</span>
          <span className="whitespace-nowrap">{it.text}</span>
        </div>
      ))}
    </div>
  )
}
