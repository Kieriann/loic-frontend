import React from 'react'


import QAFlipCard from './QAFlipCard'

const qaList = [
  { question: 'Combien ça coûte ?', answer: '10€/mois, sans engagement.' },
  { question: 'Y a-t-il une commission ?', answer: 'Aucune. 100% du montant est pour l’indépendant.' },
  { question: 'Qui choisit les profils ?', answer: 'Loïc sélectionne les meilleurs pour vous.' },
]

export default function QAFlipCardGrid() {
  return (
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {qaList.map((qa, index) => (
        <QAFlipCard key={index} {...qa} />
      ))}
    </div>
  )
}
