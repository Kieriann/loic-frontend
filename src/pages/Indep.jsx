import QAFlipCard from '../components/Home/QAFlipCard'
import HomeTopBar from '../components/Home/HomeTopBar'
import React, { useState } from 'react'

const indepQAs = [
  { question: 'Freesbiz', answer: 'Cliquez sur la flèche pour en savoir plus', fullText: 'Freebiz est bien plus qu’une plateforme : c’est un allié pour les indépendants dans un environnement économique où les freelances sont de plus en plus sous pression. Avec son service à la carte, l’absence de marge commerciale, ses options de facturation flexibles, et l’absence de clause de non-concurrence, Freebiz garantit une liberté et une rentabilité inégalées. La valorisation des profils – via les réalisations, compétences rares, et services comme la formation ou le coaching – permet de se démarquer et d’attirer des projets variés. Les services d’accompagnement, comme les partenariats avec des experts comptables, les conseils sur la retraite, les statuts juridiques, ou les cryptomonnaies, simplifient la gestion quotidienne des indépendants. Surtout, Freebiz fédère une communauté solidaire, essentielle pour survivre et prospérer face aux défis croissants du marché. Alors que les ESN perdent du terrain sous l’impact de l’IA, réduisant les opportunités et durcissant les conditions pour les freelances, Freebiz offre un espace où les indépendants se soutiennent mutuellement, partagent des ressources, et renforcent leur résilience. Rejoignez Freebiz dès aujourd’hui pour valoriser vos compétences, gérer vos projets en toute autonomie, et avancer avec le soutien d’une communauté unie !' },
  { question: 'Différences avec les ESN', answer: 'Cliquez sur la flèche pour en savoir plus', fullText: 'Contrairement aux ESN, Freesbiz ne prend aucune marge sur les contrats conclus entre les indépendants et les clients. Freesbiz n’applique pas de clause de non concurrence. Freesbiz vous met en relation avec les clients, et vous êtes libres de facturer directement si c’est possible. Vous pouvez aussi retourner chez un même client au rythme qui vous convient.' },
  { question: 'Développement de l’activité', answer: 'Cliquez sur la flèche pour en savoir plus', fullText: 'Freesbiz permet d’augmenter votre volume d’affaires, vous avez la possibilité de proposer différents types de prestations, formation, coaching, vente ou location d’outils ou de logiciels, proposition de mission… Afin de sécuriser ce type de transaction, Freesbiz génère un contrat electronique. Une marge de 2,5% du montant de la transaction est facturé. Le paiement de cette marge déclenche la mise en relation des deux parties.' },
  { question: 'Développement des compétences', answer: 'Cliquez sur la flèche pour en savoir plus', fullText: 'Freesbiz vous permet de profiter de l’expérience des autres membres dans le cadre de formations ou de coaching personnalisé. Une marge de 2,5% du montant de la transaction est facturé. Le paiement de cette marge déclenche la mise en relation des deux parties.' },
  { question: 'Facturation', answer: 'Cliquez sur la flèche pour en savoir plus', fullText: 'La facturation peut se faire en direct avec le client, ou si le client l’exige par le biais d’une facture Freesbiz qui fera l’objet d’un prélèvement de 2% sur le montant facturé.' },
  { question: 'Accompagnement', answer: 'Cliquez sur la flèche pour en savoir plus', fullText: 'Pour rester concentré sur votre activité, Fresbiz vous propose de traiter les sujets qui ont pour objectif de faciliter et d’optimiser votre activité; choix de statut, création de société, comptabilité, fiscalité, gestion de trésorerie, crypto-monnaies, préparation à la retraite… Vous avez aussi la possibilité de proposer de nouveaux sujets via votre espace personnel.' },
  { question: 'Partenariats', answer: 'Cliquez sur la flèche pour en savoir plus', fullText: 'Freesbiz a pour objectif d’établir des partenariats qui offrent une réelle plus-value. Notre société partenaire en expertise comptable offre non seulement des tarifs très attractifs, mais aussi un engagement contractuel en cas d’erreur qui sont de leur responsabilité. Des négociations dans des domaines comme l’affacturage, le portage ou tout autre sujet pourront être envisagées lorsque la CVthèque Freesbiz aura atteint une taille critique.' },
  { question: 'Abonnement', answer: 'Cliquez sur la flèche pour en savoir plus', fullText: 'L’abonnement Freesbiz est de 120 euros HT par an. Ce montant est réduit de 20% par membre parrainé et rentre dans vos charges. L’abonnement vous permet de figurer automatiquement sur les shortlists fournies au clients et d’utiliser toutes les fonctionnalités du site.' },
  { question: 'Inscription sans abonnement', answer: 'Cliquez sur la flèche pour en savoir plus', fullText: 'L’inscription sans abonnement vous permet de recevoir les opportunités qui pourraient vous intéresser. Les fonctionnalités du site ne sont pas accessibles.' },
  { question: 'Les bons plans', answer: 'Cliquez sur la flèche pour en savoir plus', fullText: 'Une rubrique "Bons plans" alimentée par les membres de Freesbiz est disponible afin d’en faire profiter la collectivité.' },

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
      <div id="qa-expand" className="px-4 mt-6" />

    </div>
  )
}
