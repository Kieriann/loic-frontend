import { useState } from 'react'
import cx from 'classnames'
import React from 'react'


export default function QAFlipCard({ question, answer }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="w-full h-40 bg-white text-center p-4 rounded-2xl shadow-lg cursor-pointer perspective"
    >
      <div
        className={cx(
          'relative w-full h-full transition-transform duration-500',
          flipped ? 'rotate-y-180' : ''
        )}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute w-full h-full backface-hidden flex items-center justify-center text-blue-500 font-semibold text-lg">
          {question}
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center text-gray-700 font-medium px-2">
          {answer}
        </div>
      </div>
    </div>
  )
}
