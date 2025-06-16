//
// ─── Bloc formulaire : liste des experiences professionnelles ──────
//

import React from 'react'

export default function ExperienceList({ data, setData }) {
  const addExperience = () => {
    setData([
      ...data,
      { title: '', description: '', skills: '', languages: '', domains: '', documents: [] },
    ])
  }

  const removeExperience = (index) => {
    const newData = [...data]
    newData.splice(index, 1)
    setData(newData)
  }

  const updateField = (index, field, value) => {
    const newData = [...data]
    newData[index][field] = value
    setData(newData)
  }

  const addDocument = (index) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = (e) => {
      const file = e.target.files?.[0]
      if (!file) return
      setData((prev) => {
        const newData = [...prev]
        const docs = newData[index].documents || []
        if (!docs.includes(file.name)) {
          newData[index].documents = [...docs, file.name]
        }
        return newData
      })
    }
    input.click()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-darkBlue">Expériences</h2>

      {data.map((exp, index) => (
        <div key={index} className="space-y-4 border border-primary p-4 rounded relative">
          {data.length > 1 && (
            <button
              onClick={() => removeExperience(index)}
              className="absolute top-2 right-2 text-red-500 border border-red-500 px-2 py-1 rounded hover:bg-red-500 hover:text-white transition text-sm"
            >
              Supprimer
            </button>
          )}

          <input
            type="text"
            placeholder="Titre de l'expérience (développement, sécurité...)"
            value={exp.title}
            onChange={(e) => updateField(index, 'title', e.target.value)}
            className="w-full p-2 border border-primary rounded"
          />
          <textarea
            placeholder="Description"
            rows={4}
            value={exp.description}
            onChange={(e) => updateField(index, 'description', e.target.value)}
            className="w-full p-2 border border-primary rounded resize-none"
          />
          <input
            type="text"
            placeholder="Compétences clés"
            value={exp.skills}
            onChange={(e) => updateField(index, 'skills', e.target.value)}
            className="w-full p-2 border border-primary rounded"
          />
          <input
            type="text"
            placeholder="Langages utilisés"
            value={exp.languages}
            onChange={(e) => updateField(index, 'languages', e.target.value)}
            className="w-full p-2 border border-primary rounded"
          />
          <input
            type="text"
            placeholder="Domaines (ex : santé, finance)"
            value={exp.domains}
            onChange={(e) => updateField(index, 'domains', e.target.value)}
            className="w-full p-2 border border-primary rounded"
          />

          <div>
            <button
              onClick={() => addDocument(index)}
              className="bg-gray-200 text-sm px-3 py-1 rounded"
            >
              Ajouter doc
            </button>
            <ul className="text-xs mt-2 text-gray-600 list-disc list-inside">
              {exp.documents?.map((name, i) => (
                <li key={i}>{name}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      <div className="text-center pt-4">
        <button
          onClick={addExperience}
          className="text-darkBlue border border-darkBlue px-3 py-1 rounded hover:bg-darkBlue hover:text-white transition"
        >
          Ajouter une expérience
        </button>
      </div>
    </div>
  )
}
