import QAFlipCard from '../components/Home/QAFlipCard'
import HomeTopBar from '../components/Home/HomeTopBar'
import React, { useState } from 'react'

const indepQAs = [
  { question: 'Quel est le coût ?', answer: '10€/mois, sans engagement.' },
  { question: 'Y a-t-il une commission ?', answer: 'Non, 100% des revenus vous revient.' },
  { question: 'Puis-je facturer en direct ?', answer: 'Oui, vous pouvez conserver 100% du montant.' },
  { question: 'Freebiz peut-elle gérer la facturation ?', answer: 'Oui, pour 3-4%, Freebiz s’occupe de tout.' },
  { question: 'Puis-je être payé immédiatement ?', answer: 'Oui, grâce au factoring avec frais réduits.' },
  { question: 'Y a-t-il une clause de non-concurrence ?', answer: 'Aucune clause n’est imposée.' },
  { question: 'Puis-je retravailler avec un client Freebiz ?', answer: 'Oui, dès que vous le souhaitez.' },
  { question: 'Comment Freebiz valorise-t-elle mon profil ?', answer: 'Par vos projets, compétences rares, et services proposés.' },
  { question: 'Puis-je proposer des formations ou coachings ?', answer: 'Oui, ces services sont mis en avant.' },
  { question: 'Mes tarifs sont-ils compétitifs ?', answer: 'Oui, car Freebiz ne prend pas de marge.' },
  { question: 'Puis-je fixer mes horaires et tarifs ?', answer: 'Oui, vous êtes totalement autonome.' },
  { question: 'Y a-t-il une communauté ?', answer: 'Oui, les indépendants s’entraident et partagent des ressources.' },
]

export default function Indep() {
  return (
    <div className="min-h-screen py-10 px-4 pt-28">
      <HomeTopBar isConnected={!!localStorage.getItem('token')} />
      <div className="relative max-w-6xl mx-auto mt-10 w-full h-[800px]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold text-center z-10">
          Pour l’indépendant
        </div>

        {indepQAs.map((qa, i) => {
          const [z, setZ] = useState(10 + i)

          return (
            <div
              key={i}
              className="absolute w-36 h-10 transition-all duration-200"
              style={{
                top: `${40 + 30 * Math.sin((i / indepQAs.length) * 2 * Math.PI)}%`,
                left: `${50 + 35 * Math.cos((i / indepQAs.length) * 2 * Math.PI)}%`,
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
