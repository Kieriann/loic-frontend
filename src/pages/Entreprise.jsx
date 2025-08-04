import QAFlipCard from '../components/Home/QAFlipCard'
import React, { useState } from 'react'
import HomeTopBar from '../components/Home/HomeTopBar'

const entrepriseQAs = [
  { question: 'Combien coûte l’accès client ?', answer: 'C’est 100 % gratuit, sans inscription ni frais d’utilisation.' },
  { question: 'Comment faire une demande ?', answer: 'Depuis un espace client simple et gratuit.' },
  { question: 'Quel est le délai de réponse ?', answer: 'Une shortlist en 48h maximum, scorée automatiquement.' },
  { question: 'Les profils sont-ils triés ?', answer: 'Oui, grâce à un système de scoring automatisé.' },
  { question: 'Quels types de profils avez-vous ?', answer: 'De tout, y compris des experts rares (Rust, Haskell…).'},
  { question: 'Puis-je avoir une équipe complète ?', answer: 'Oui, grâce à la collaboration entre freelances.' },
  { question: 'Peut-on choisir comment payer ?', answer: 'Oui : direct au freelance ou via Freebiz (3-4 % côté freelance).' },
  { question: 'Y a-t-il du paiement différé ?', answer: 'Oui, selon vos besoins.' },
  { question: 'Pourquoi les freelances restent fidèles ?', answer: 'Parce qu’ils gagnent plus, sans marge imposée.' },
  { question: 'Et si je ne trouve pas ?', answer: 'Loïc ou la communauté vous trouvent la bonne personne.' },
  { question: 'Freebiz, c’est une SSII ?', answer: 'Non. C’est une plateforme libre et automatisée.' },
  { question: 'Et l’IA dans tout ça ?', answer: 'Elle optimise les recherches et accélère les réponses.' },
]

export default function Entreprise() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6bb3d6] to-[#94c9df] py-10 px-4 pt-28">
      <HomeTopBar isConnected={!!localStorage.getItem('token')} />
      <div className="relative max-w-6xl mx-auto mt-10 w-full h-[800px]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold text-center z-10">
          Pour l’entreprise
        </div>

        {entrepriseQAs.map((qa, i) => {
          const [z, setZ] = useState(10 + i)

          return (
            <div
              key={i}
              className="absolute w-36 h-10 transition-all duration-200"
              style={{
                top: `${40 + 30 * Math.sin((i / entrepriseQAs.length) * 2 * Math.PI)}%`,
                left: `${50 + 35 * Math.cos((i / entrepriseQAs.length) * 2 * Math.PI)}%`,
                transform: `translate(-50%, -50%) rotate(${(Math.random() - 0.5) * 10}deg)`,
                zIndex: z,
              }}
              onMouseEnter={() => setZ(999)}
              onMouseLeave={() => setZ(10 + i)}
            >
              <QAFlipCard {...qa} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
